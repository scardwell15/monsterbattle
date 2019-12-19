const {
    graphql, 
    buildSchema, 
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLNonNull,
    GraphQLString,
} = require("graphql")

const { profileInterface, getUserByName, getProfileLoaderByName, createNewUser } = require("./gql_profile.js")

const mutationType = new GraphQLObjectType({
    name: "mutation",
    fields: () => ({
        newProfile: {
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
            resolve: async (_source, {username, password}) => await createNewUser(username, password)
        }
    })
})

const queryType = new GraphQLObjectType({
    name: "query",
    fields: () => ({
        profile: {
            type: profileInterface,
            args: {
                username: {
                    description: "Username",
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_source, {username}) => await getUserByName(username, getProfileLoaderByName)
        },
    })
})

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    types: [profileInterface]
});

module.exports = {schema};

