const prompt = require("inquirer").createPromptModule()
const {addCLIFunc} = require("../commands.js")

/**
 * @param {string} input - The string
 */
function listTransformer(input, answers, flags) { //automatically formats input to user CLI
    var text = input.replace(/(.) */g,"$1")
    text = text.replace(/, */g,", ")
    if(flags.isFinal) {
        return "[" + text + "]"
    }
    return "[" + text
}

/**
 * @param {string} input - The string
 * @returns {string} value - Return value
 */
function listToStringList(input) { //returns a string that is formatted like a JS list "1,-2,3"
    var value = input;
    value = value.replace(/\s/g,"") //remove spaces if they exist
    value = value.replace(/^(.*),$/g,"$1") //remove trailing comma
    return value
}

/**
 * @param {string} input - The string
 */
function listValidate(input) { //validates input sent to function
    var value = listToStringList(input);
    var pass = value.match(
        /^(,?(\d+))+$/i
    )
    if(pass) {
        return true
    }
}

var numberPrompt = {
    type: "input",
    name: "input",
    message: "Input IDs denoted by comma and space. 1, 2, 3 is valid.",
    validate: listValidate,
    transformer: listTransformer
}

function replaceActivePokemonPrompt() {
    prompt(numberPrompt).then(({input}) => {
        var value = listToStringList(input)
        var listMonsters = value.split(",")
    })
}

addCLIFunc("Replace active pokemon", replaceActivePokemonPrompt)