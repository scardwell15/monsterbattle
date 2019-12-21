const {
    graphql, 
    buildSchema, 
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLNonNull,
    GraphQLString,
} = require("graphql")
const { GraphQLServer } = require('graphql-yoga');

const { profileInterface, getUserByName, getProfileLoaderByName, createNewUser, login } = require("./gql_profile.js")

//mutations modify things in some way.
const mutationType = new GraphQLObjectType({
    name: "mutation",
    fields: () => ({
        newProfile: { //create a new profile
            type: profileInterface,
            args: {
                username: {
                    description: "Username",
                    type: GraphQLNonNull(GraphQLString)
                },
                password: {
                    description: "Password",
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_source, {username, password}, context) => await createNewUser(username, password, context)
        },
        login: { //login. this doesn't modify the database, but it does modify the session.
            type: profileInterface,
            args: {
                username: {
                    description: "Username",
                    type: GraphQLNonNull(GraphQLString)
                },
                password: {
                    description: "Password",
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_source, {username, password}, context) => await login(username, password, context)
        }
    })
})

//queries retrieve information from the database.
const queryType = new GraphQLObjectType({
    name: "query",
    fields: () => ({
        profile: { //retrieve a profile and current pokemon
            type: profileInterface,
            args: {
                username: {
                    description: "Username",
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_source, {username}) => await getUserByName(username, getProfileLoaderByName)
        }
    })
})

//note that queries and mutations don't necessarily have to follow those rules.
//it's just good practice to keep them separate.
const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    types: [profileInterface]
});

const context = (req) => ({
    req: req.request,
  });

const server = new GraphQLServer({
    schema: schema,
    context: context
})


module.exports = {server, schema};

