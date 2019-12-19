var knex = require('knex')({
    client: 'pg',
    connection: {
        host : 'localhost',
        user : 'postgres',
        password : '$ecure',
        database : 'postgres'
    }
});

module.exports = {
    knex
}