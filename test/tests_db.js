const { expect } = require('chai')
const { describe, it } = require('mocha')
const { graphqlSync, graphql } = require("graphql")
const { schema } = require('../graphql/gql_schema.js')
const { getUserByName, userLoaderByName } = require("../graphql/gql_profile.js")

function querySchema(source) {
    const result = graphqlSync({ schema: schema, source });
    expect(Object.keys(result)).to.deep.equal(['data']);
    return result.data;
}

describe('Introspection tests', () => {
    it("Checks that all types are set up correctly in the database.", () => {
        const data = querySchema(`
            {
                __schema {
                    types {
                    name
                    }
                }
            }
        `);
        expect(data).to.deep.equal({
            __schema: {
                types: [
                    { name: 'Query' },
                    { name: 'String' },
                    { name: 'Profile' },
                    { name: 'Int' },
                    { name: '__Schema' },
                    { name: '__Type' },
                    { name: '__TypeKind' },
                    { name: 'Boolean' },
                    { name: '__Field' },
                    { name: '__InputValue' },
                    { name: '__EnumValue' },
                    { name: '__Directive' },
                    { name: '__DirectiveLocation' },
                ]
            }
        })
    }),
    it("Checks that we can query the database with our query.", () => {
        const data = querySchema(`
        {
            __schema {
                queryType {
                    name
                }
            }
        }`)
        expect(data).to.deep.equal({
            __schema: {
                queryType: {
                    name: 'Query'
                }
            }
        })
    })

    it("Checks that we can query the database for a profile.", () => {
        const data = querySchema(`
        {
            __type(name: "Profile") {
                name
                kind
            }
        }`)
        expect(data).to.deep.equal({
            __type: {
                name: "Profile",
                kind: "OBJECT"
            }
        })
    })

    it("Checks that we can query the database for a profile field.", () => {
        const data = querySchema(`
        {
            __type(name: "Profile") {
                name
                fields {
                    name
                    type {
                        name
                        kind
                    }
                }
            }
        }`)
        expect(data).to.deep.equal({
            __type: {
                name: "Profile",
                fields: [
                    {
                        name: "user_id",
                        type: { name:"Int", kind: "SCALAR" }
                    },
                    {
                        name: "username",
                        type: { name: null, kind: 'NON_NULL' }
                    },
                    {
                        name: "password",
                        type: { name: null, kind: 'NON_NULL' }
                    },
                    {
                        name: "battles",
                        type: { name: "Int", kind: 'SCALAR' }
                    },
                    {
                        name: "wins",
                        type: { name: "Int", kind: 'SCALAR' }
                    },
                    {
                        name: "current_pokemon",
                        type: { name: null, kind: 'LIST' }
                    },
                ]
            }
        })
    })
})

describe("Query tests", () => {
    it("Checks that we can query for a user through DataLoader.", async () => {
        const user = await getUserByName("seth", userLoaderByName)
        expect(user.username).to.be.equal("seth")
    })

    it("Checks that we can query for a user through GraphQL.", async () => {
        const source = `
        query UserNameTest {
            Profile(username: "seth") {
                user_id
                username
                password
                battles
                wins
                current_pokemon
            }
        }`

        const result = await graphql({schema, source})
        expect(result).to.deep.equal({
            data: {
                Profile: { //note that result.data.Profile is an actual object.
                    user_id: 1,
                    username: "seth",
                    password: "81dc9bdb52d04dc20036dbd8313ed055",
                    battles: 100,
                    wins: 60,
                    current_pokemon: [1,2,3,4]
                }
            }
        })
    })
})