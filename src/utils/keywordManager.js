const ERROR_MSG = require('../constants/ERROR_MSG');
const commandMap = require('../syntax/commands').toCommandMap();
const functionMap = require('../syntax/functions').toFunctionMap();
const keywordMap = require('../syntax/keywords').toKeywordMap();

const findFunction = candidate => {
    if (keywordMap[candidate])
        throw new Error(ERROR_MSG.INVALID_KEYWORD(candidate));
    const commandMatch = commandMap[candidate];
    if (commandMatch) {
        const shortestCommand = commandMatch[commandMatch.length - 1];
        if (shortestCommand.wordCount === 1)
            throw new Error(ERROR_MSG.INVALID_COMMAND_POSITION(shortestCommand.command.name));
    }
    const shortName = name.charAt(0) === '$' ? name.slice(1) : name;
    if (!shortName)
        throw new Error(ERROR_MSG.INVALID_SYMBOL('$'));
    const funcValue = functionMap[shortName];
    return funcValue ? funcValue : null;
};

const findCommand = (candidate, fullString) => {
    const mapValue = commandMap[candidate];
    if (!mapValue)
        return null;
    for (const entry of mapValue) {
        if (entry.wordCount === 1) {
            return {
                match: candidate,
                command: entry.command
            };
        }
        const commandMatch = fullString.match(entry.regex);
        if (commandMatch) {
            return {
                match: commandMatch[0],
                command: entry.command
            };
        }
    }
    return null;
};

exports.findFunction = findFunction;
exports.findCommand = findCommand;
