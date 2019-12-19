const program = require("commander")
const {displayCLI} = require("./commands.js")
require("./appFunctions.js")

program.command("cli")
    .alias("c")
    .description("Run the CLI")
    .action(() => displayCLI())

program.parse(process.argv)