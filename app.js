const program = require("commander")
const path = require("path")

const session = require("express-session");
const asyncHandler = require("express-async-handler")

const ms = require("ms");

const {displayCLI} = require("./commands.js")
const {server} = require("./graphql/gql_schema.js")
const {login} = require("./graphql/gql_profile.js")

program.command("cli")
    .alias("c")
    .description("Run the CLI")
    .action(() => displayCLI())

program.command("run-server")
    .alias("r")
    .description("Run the server")
    .action(() => {
        const opts = {
            port: 4000, //what port to run graphiQL on
            playground: true, //set to false to disable graphiQL
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

          //TODO: write custom error handler for missing parameters
          // result 0: success
          // result 1: invalid user
          // result 2: bad password

          //asyncHandler has a try/catch statement inside that calls "next" for error catching
          server.express.route("/login").post(asyncHandler(async (req, res) => {
                var username = req.body.username
                var password = req.body.password

                var {result, username} = await login(username, password, {req, res})
                res.status(result)
                console.log("login called with result " + result)
                if(result == 0) {
                    req.session.user = username
                }
          })).get(asyncHandler(async (req, res) => {
                res.sendFile(path.join(__dirname + "/test.html"))
          }))

          //start server
          server.start(opts, () => console.log(`Server is running on http://localhost:${opts.port}`))
    })

program.parse(process.argv)