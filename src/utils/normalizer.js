const syntaxUtils = require('./syntaxUtils');
const QspError = require('../classes/QspError');

const splitRawQspString = str => str.split(/\r?\n/);

const getComment = (rawLines, startLineIndex, startCharIndex, commentMap) => {
    let lineIndex = startLineIndex;
    let charIndex = startCharIndex;
    while (true) {
        const lineTail = rawLines[lineIndex].slice(charIndex);
        const literalStartIndex = lineTail.search(/['"{]/);
        if (literalStartIndex < 0)
            break;
        const stringBorders = syntaxUtils.findStringBorders(rawLines, lineIndex, charIndex + literalStartIndex);
        lineIndex = stringBorders.endLineIndex;
        charIndex = stringBorders.endCharIndex + 1;
    }
    commentMap[startLineIndex] = startCharIndex;
    for (let i = startLineIndex + 1; i <= lineIndex; ++i)
        commentMap[i] = 0;
    return lineIndex;
};

const getStringsAndComments = (blockName, rawLines) => {
    const stringMap = {};
    const commentMap = {};
    for (let lineIndex = 0; lineIndex < rawLines.length; ++lineIndex) {
        try {
            const isCommentLineStart = rawLines[lineIndex].search(/^\s*!/) === 0;
            if (isCommentLineStart) {
                lineIndex = getComment(rawLines, lineIndex, 0, commentMap);
                continue;
            }
            let charIndex = 0;
            while (true) {
                const lineTail = rawLines[lineIndex].slice(charIndex);
                const stringOrCommentMatchIndex = lineTail.search(/['"{]|&\s*!/);
                if (stringOrCommentMatchIndex < 0)
                    break;
                const absoluteMatchIndex = stringOrCommentMatchIndex + charIndex;
                const isCommentStart = lineTail.charAt(stringOrCommentMatchIndex) === '&';
                if (isCommentStart) {
                    lineIndex = getComment(rawLines, lineIndex, absoluteMatchIndex + 1, commentMap);
                    break;
                }
                const stringBorders = syntaxUtils.findStringBorders(rawLines, lineIndex, absoluteMatchIndex);
                if (!stringMap[lineIndex])
                    stringMap[lineIndex] = [];
                stringMap[lineIndex].push(stringBorders);
                lineIndex = stringBorders.endLineIndex;
                charIndex = stringBorders.endCharIndex + 1;
            }
        } catch (err) {
            throw new QspError(err.message, blockName, lineIndex + 1, err);
        }
    }
    return { stringMap, commentMap };
};

const writeLine = (line, lineNumber, result) => {
    if (!line)
        return;
    result.normalizedLines.push(line);
    result.lineNumbers.push(lineNumber);
};

const checkForMultilineBlock = line => {
    const keywordMatch = line.match(/^(IF|ACT)(?:[!&=<>+*/,'":(){}\-\[\]\s].*?)?:/);
    return keywordMatch && keywordMatch[0].length !== line.length;
};

const splitAndWriteLine = (line, lineNumber, result) => {
    if (line.startsWith('IF') || line.startsWith('ACT')) {
        checkForMultilineBlock(line, lineNumber, result, splitAndWriteLine);
        return;
    }
    for (let i = 0; i < line.length; ++i) {
        const char = line.charAt(i);
        switch (char) {
            case '(':
            case '[':
                i = syntaxUtils.findBracket(line, i);
                continue;
            case '&':
                const head = line.slice(0, i).trim();
                writeLine(head, lineNumber, result);
                const tail = line.slice(i + 1).trim();
                splitAndWriteLine(tail, lineNumber, result);
                return;
        }
    }
    writeLine(line, lineNumber, result);
};

const normalize = (blockName, rawLines) => {
    const {stringMap, commentMap} = getStringsAndComments(blockName, rawLines);
    const result = {
        lineNumbers: [],
        normalizedLines: []
    };
    const stringLiterals = [];
    for (let lineIndex = 0; lineIndex < rawLines.length; ++lineIndex) {
        let charIndex = 0;
        let aggregateString = '';
        while (true) {
            if (stringMap[lineIndex]) {
                const strings = stringMap[lineIndex];
                for (const str of strings) {
                    aggregateString +=
                        rawLines[lineIndex].slice(charIndex, str.startCharIndex) + `'${stringLiterals.length}'`;
                    stringLiterals.push(syntaxUtils.extractStringLiteral(rawLines, str));
                    charIndex = str.endCharIndex + 1;
                }
                const lastStringBorders = strings[strings.length - 1];
                if (lastStringBorders.startLineIndex !== lastStringBorders.endLineIndex) {
                    lineIndex = lastStringBorders.endLineIndex;
                    continue;
                }
            }
            const lineTail = rawLines[lineIndex].slice(charIndex,
                commentMap[lineIndex] >= 0
                    ? commentMap[lineIndex]
                    : rawLines[lineIndex].length
            );
            const continuationTokenIndex = lineTail.search(/\s+_\s*$/);
            if (continuationTokenIndex < 0 || continuationTokenIndex === 0 && charIndex === 0) {
                aggregateString += lineTail;
                break;
            }
            aggregateString += ' ' + lineTail.slice(0, continuationTokenIndex);
            charIndex = 0;
            if (++lineIndex === rawLines.length)
                break;
        }
        const formattedLine = aggregateString.trim().replace(/\t/g, ' ').toUpperCase();
        try {
            splitAndWriteLine(formattedLine, lineIndex + 1, result);
        } catch (err) {
            throw new QspError(err.message, blockName, lineIndex + 1, err);
        }
    }
};

exports.splitRawQspString = splitRawQspString;
exports.getStringsAndComments = getStringsAndComments;
