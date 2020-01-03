const {GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt} = require("graphql")

const DataLoader = require("dataloader")
const { knex } = require("../db.js")

class Profile {
    user_id
    username
    password
    battles
    wins
    current_pokemon
    constructor() {
    }
}

const profileInterface = new GraphQLObjectType({
    name: 'Profile',
    description: 'User profile',
    fields: () => ({
        user_id: {
            type: GraphQLInt,
            description: "User ID of profile"
        },
        username: {
            type: GraphQLNonNull(GraphQLString),
            description: "Username of profile"
        },
        password: {
            type: GraphQLNonNull(GraphQLString),
            description: "Password of profile (hashed)"
        },
        battles: {
            type: GraphQLInt,
            description: "Number of battles the user has been in"
        },
        wins: {
            type: GraphQLInt,
            description: "Number of battles the user has won"
        },
        current_pokemon: {
            type: GraphQLList(GraphQLNonNull(GraphQLInt)),
            description: "List of current pokemon identified by ID."
        }
    })
});

//NOTE: best practice for loaders is per session. they cache a LOT of data so using the same one for too long is bad.
//the join gets all of the rows that match the user ID inside the current pokemon table.
const getProfileLoaderByName = new DataLoader(
    usernames => knex.select("profile.user_id", "username", "password", "battles", "wins", "current_pokemon.pokemon").from("profile")
        .leftJoin("current_pokemon", function() {
            this.on('current_pokemon.owner', '=', 'profile.user_id')
        }).whereIn("username", usernames)
        .then(rows => usernames.map(username => rows.filter(user => user.username === username)))
)

//logged in users
var database = []

async function getUserByName(username) {
    if(database[username]) {
        return database[username]
    }
    const rows = await getProfileLoaderByName.load(username) //the loader returns a list of rows.
    if(rows.length > 0) {
        var target = rows[0] //select first one. all of them have the same data.. except pokemon_id.

        var newProfile = new Profile()
        newProfile.username = target.username
        newProfile.password = target.password
        newProfile.user_id = target.user_id
        newProfile.battles = target.battles
        newProfile.wins = target.wins
        newProfile.current_pokemon = []
        for(let i = 0; i < rows.length; i++) { //this puts the data into our new object.
            newProfile.current_pokemon.push(rows[i].pokemon)
        }

        return newProfile
    }
}

//create a new user
async function createNewUser(username, password) {
    await knex.insert({ username: username,
                        password: password,
                        battles: 0,
                        wins: 0
                    }).into("profile")
}

async function login(username, password, context) {
    const profile = await getUserByName(username)
    if(profile == null) {
        console.log("Bad profile")
        return {result: 1}
    }

    if(password !== profile.password) {
        console.log("Bad password")
        return {result: 2}
    }

    console.log("Password matched")
    database[username] = profile
    return {result: 0, username: username} //return username to signal success
}

module.exports = {profileInterface, getUserByName, getProfileLoaderByName, createNewUser, login}