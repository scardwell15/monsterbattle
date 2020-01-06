var knex = require('knex')({
    client: 'pg',
    connection: {
        host : 'ec2-3-87-182-216.compute-1.amazonaws.com',
        user : 'postgres',
        password : '$ecure',
        database : 'postgres'
    }
});

module.exports = {
    knex
}