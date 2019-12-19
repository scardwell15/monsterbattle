const prompt = require("inquirer").createPromptModule()
const {addCLIFunc} = require("./commands.js")

function max(a,b) {
    return a > b ? a : b
}

function getLargestSubArray(nums) {
    var globalMax = nums[0];
    var currentMax = nums[0];
    for(let i = 1; i < nums.length; i++){
        currentMax = max(nums[i], currentMax + nums[i])
        globalMax = max(currentMax, globalMax)
    }
    return globalMax
}

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

function listToStringList(input) { //returns a string that is formatted like a JS list "1,-2,3"
    var value = input;
    value = value.replace(/\s/g,"") //remove spaces if they exist
    value = value.replace(/^(.*),$/g,"$1") //remove trailing comma
    return value
}
/**
 * @param {string} input - The string
 * @var {string} value - Parsed string
 */
function listValidate(input) { //validates input sent to function
    var value = input;
    value = value.replace(/\s/g,"") //remove spaces if they exist
    value = value.replace(/^(.*),$/g,"$1") //remove trailing comma
    var pass = value.match(
        /^(,?(-?\d+))+$/i
    )
    if(pass) {
        return true
    }
}

var numberPrompt = {
    type: "input",
    name: "input",
    message: "Input numbers denoted by comma and space. 1, 2, 3 is valid.",
    validate: listValidate,
    transformer: listTransformer
}

function pickedLargestSub() {
    prompt(numberPrompt).then(({input}) => {
        console.log("Output from prompt was: "+ input)
    })
}

addCLIFunc("Get largest subarray", pickedLargestSub)