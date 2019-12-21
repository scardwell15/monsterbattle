const program = require("commander")
const session = require('express-session');
const ms = require('ms');
const uuid    = require('uuid/v4');

const {displayCLI} = require("./commands.js")
const {server} = require("./graphql/gql_schema.js")

program.command("cli")
    .alias("c")
    .description("Run the CLI")
    .action(() => displayCLI())

program.command("run-server")
    .alias("r")
    .description("Run the server")
    .action(() => {
        const opts = {
            port: 4000,
            cors: {
                credentials: true,
                origin: ['http://localhost:8080'] //front end url
            }
        }

        server.express.use(session({
            name: 'qid',
            secret: `monsterbattlesecret123456`,
            resave: true,
            saveUninitialized: true,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                maxAge: ms('1d')
            }
          }))

          //start server
          server.start(opts, () => console.log(`Server is running on http://localhost:${opts.port}`))
    })

program.parse(process.argv)