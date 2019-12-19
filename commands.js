const prompt = require("inquirer").createPromptModule()

var runPrompts = {
        type: "list",
        name: "selected",
        message: "Pick a function",
        choices: [
        ]
    }

var runFunctions = {
}

/**
 * @param {String} option - The string
 * @param {Function} func - The function
 */

function addCLIFunc(option, func) {
    runPrompts.choices.push(option)
    runFunctions[option] = func
}

function displayCLI() {
    prompt(runPrompts).then(({selected}) => {
        runFunctions[selected]()
    })
}

module.exports = {displayCLI, addCLIFunc, runPrompts, runFunctions}