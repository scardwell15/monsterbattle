var knex = require('knex')({
    client: 'pg',
    connection: {
        host : '72.93.64.131',
        user : 'postgres',
        password : '$ecure',
        database : 'postgres'
    }
});

module.exports = {
    knex
}