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
                    lineIndex = getComment(rawLines, lineIndex, absoluteMatchIndex, commentMap);
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

exports.splitRawQspString = splitRawQspString;
exports.getStringsAndComments = getStringsAndComments;
