const ERROR_MSG = require('../constants/ERROR_MSG');

const brackets = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
};

const findBracket = (str, startIndex) => {
    const opening = str.charAt(startIndex);
    const closing = brackets[opening];
    let bracketCount = 1;
    for (let i = startIndex + 1; i < str.length; ++i) {
        const char = str.charAt(i);
        if (char === closing && --bracketCount === 0)
            return i;
        if (char === opening)
            ++bracketCount;
    }
    throw new Error(ERROR_MSG.BRACKET_NOT_FOUND(opening));
};

const validateArgCount = (args, procName, minArgs, maxArgs) => {
    if (args.length < minArgs || maxArgs >= 0 && args.length > maxArgs)
        throw new Error(ERROR_MSG.INVALID_ARG_COUNT(procName));
};

const splitArguments = args => {
    if (!args)
        return [];
    let result = [];
    let index = 0;
    for (let i = 0; i < args.length; ++i) {
        const char = args.charAt(i);
        if (char === '(' || char === '[') {
            i = findBracket(args, i);
        } else if (char === ',') {
            const argument = args.slice(index, i).trim();
            if (!argument)
                throw new Error(ERROR_MSG.ARG_SPLIT_ERROR);
            result.push(argument);
            index = i + 1;
        }
    }
    const lastArgument = args.slice(index).trim();
    if (!lastArgument)
        throw new Error(ERROR_MSG.ARG_SPLIT_ERROR);
    result.push(lastArgument);
    return result;
};

const findNonEmptySymbol = (str, startIndex) => {
    for (let i = startIndex; i < str.length; ++i) {
        if (str.charAt(i) !== ' ')
            return i;
    }
    return -1;
};

exports.findBracket = findBracket;
exports.splitArguments = splitArguments;
exports.findNonEmptySymbol = findNonEmptySymbol;
exports.validateArgCount = validateArgCount;
