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
        if (char === closing) {
            if (--bracketCount === 0)
                return i;
        } else if (char === opening) {
            ++bracketCount;
        }
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

const findSimpleStringBorders = (rawLines, startLineIndex, startCharIndex) => {
    const terminatingSymbol = rawLines[startLineIndex].charAt(startCharIndex);
    let charIndex = startCharIndex + 1;
    for (let lineIndex = startLineIndex; lineIndex < rawLines.length; ++lineIndex) {
        const line = rawLines[lineIndex];
        for (let i = charIndex; i < line.length; ++i) {
            if (line.charAt(i) !== terminatingSymbol)
                continue;
            if (line.charAt(i + 1) === terminatingSymbol)
                ++i;
            else
                return ({
                    startLineIndex: startLineIndex,
                    startCharIndex: startCharIndex,
                    endLineIndex: lineIndex,
                    endCharIndex: i
                });
        }
        charIndex = 0;
    }
    throw new Error(`Failed to parse string literal: terminating bracket '${terminatingSymbol}' not found`);
};

const findDynamicStringBorders = (rawLines, startLineIndex, startCharIndex) => {
    let bracketCount = 1;
    let charIndex = startCharIndex + 1;
    for (let lineIndex = startLineIndex; lineIndex < rawLines.length; ++lineIndex) {
        for (let i = charIndex; i < rawLines[lineIndex].length; ++i) {
            const char = rawLines[lineIndex].charAt(i);
            if (char === '}') {
                if (--bracketCount === 0)
                    return ({
                        startLineIndex: startLineIndex,
                        startCharIndex: startCharIndex,
                        endLineIndex: lineIndex,
                        endCharIndex: i
                    });
            } else if (char === '{') {
                ++bracketCount;
            } else if (char === "'" || char === '"') {
                const borders = findSimpleStringBorders(rawLines, lineIndex, i);
                lineIndex = borders.endLineIndex;
                i = borders.endCharIndex;
            }
        }
        charIndex = 0;
    }
    throw new Error(`Failed to parse dynamic string literal: terminating bracket '}' not found`);
};

const findStringBorders = (rawLines, startLineIndex, startCharIndex) => {
    if (rawLines[startLineIndex].charAt(startCharIndex) === '{')
        return findDynamicStringBorders(rawLines, startLineIndex, startCharIndex);
    return findSimpleStringBorders(rawLines, startLineIndex, startCharIndex);
};

exports.findBracket = findBracket;
exports.splitArguments = splitArguments;
exports.findNonEmptySymbol = findNonEmptySymbol;
exports.validateArgCount = validateArgCount;
exports.findStringBorders = findStringBorders;
