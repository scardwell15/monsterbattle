const {GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt} = require("graphql")

const DataLoader = require("dataloader")
const { knex } = require("../db.js")
const Profile = require("../types/profile.ts")

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

//NOTE: best practice for this is per session.
const userLoaderByName = new DataLoader(
    usernames => knex.select("profiles.user_id", "username", "password", "battles", "wins", "current_pokemon.pokemon_id").from("profiles")
        .leftJoin("current_pokemon", function() {
            this.on('current_pokemon.user_id', '=', 'profiles.user_id')
        }).whereIn("username", usernames)
        .then(rows => usernames.map(username => rows.filter(user => user.username === username)))
)

async function getUserByName(username, loader) {
    const rows = await loader.load(username)
    if(rows.length > 0) {
        var target = rows[0] //select first one, all of them have the same data.. except pokemon_id.
        var newProfile = new Profile()
        newProfile.username = target.username
        newProfile.password = target.password
        newProfile.user_id = target.user_id
        newProfile.battles = target.battles
        newProfile.wins = target.wins
        newProfile.current_pokemon = []
        for(let i = 0; i < rows.length; i++) {
            newProfile.current_pokemon.push(rows[i].pokemon_id)
        }
        return newProfile
    }
}

module.exports = {profileInterface, getUserByName, userLoaderByName}