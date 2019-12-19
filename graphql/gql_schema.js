const {
    graphql, 
    buildSchema, 
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLNonNull,
    GraphQLString
} = require("graphql")

const { profileInterface, getUserByName, userLoaderByName } = require("./gql_profile.js")

const queryType = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        Profile: {
            type: profileInterface,
            args: {
                username: {
                    description: "Username",
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_source, {username}) => await getUserByName(username, userLoaderByName)
        }
    })
})

const schema = new GraphQLSchema({
    query: queryType,
    types: [profileInterface]
});

module.exports = {schema};