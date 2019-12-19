const { expect } = require('chai')
const { describe, it } = require('mocha')
const { graphqlSync, graphql } = require("graphql")
const { schema } = require('../graphql/gql_schema.js')
const { getUserByName, getProfileLoaderByName } = require("../graphql/gql_profile.js")
const { knex } = require("../db.js")

function querySchema(source) {
    const result = graphqlSync({ schema: schema, source: source });
    console.log(result)
    expect(Object.keys(result)).to.deep.equal(['data']);
    return result.data;
}

describe("Query tests", () => {
    it("Checks that we can query for a user through DataLoader.", async () => {
        const user = await getUserByName("seth", getProfileLoaderByName)
        expect(user.username).to.be.equal("seth")
    })

    it("Checks that we can query for a user through GraphQL.", async () => {
        const source = `
        query UserNameTest {
            profile(username: "seth") {
                user_id
                username
                password
                battles
                wins,
                current_pokemon
            }
        }`

        const result = await graphql({schema, source})
        expect(result).to.deep.equal({
            data: {
                profile: { //note that result.data.Profile is an actual object.
                    user_id: 1,
                    username: "seth",
                    password: "81dc9bdb52d04dc20036dbd8313ed055",
                    battles: 100,
                    wins: 60,
                    current_pokemon: [1,2,3,4,5,6]
                }
            }
        })
    })

    it("Checks that we can add a new user to the database.", async () => {
        const newSource = `
        mutation AddNewUserTest($username: String!, $password: String!) {
            newProfile(username: $username, password: $password) {
                user_id
            }
        }`

        const testValues = {username: "Test", password: "2c9ef15a83fc194fe81c9894b63fd3ae"}
        await graphql({schema: schema, source: newSource, variableValues: testValues})
        
        const getSource = `
        query GetNewUserTest($username: String!) {
            profile(username: $username) {
                username
            }
        }`

        const result = await graphql({schema: schema, source: getSource, variableValues: testValues})
        
        await knex.delete().from("profile").where(testValues) //delete user to not clog database with test values

        expect(result).to.deep.equal({
            data: {
                profile: { //note that result.data.Profile is an actual object.
                    username: "Test"
                }
            }
        })
    })
}) 