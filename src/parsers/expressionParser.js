const ERROR_MSG = require('../constants/ERROR_MSG');
const expressionFactory = require('../utils/expressionFactory');
const exprTreeBuilder = require('../utils/exprTreeBuilder');
const syntaxUtils = require('../utils/syntaxUtils');
const keywordManager = require('../utils/keywordManager');
const variableParser = require('./variableParser');

const readToken = (str, tokenList, parseFunc) => {
    if (str.charAt(0) === '(') {
        const closingBracketIndex = syntaxUtils.findBracket(str, 0);
        tokenList.push(parseFunc(str.slice(1, closingBracketIndex).trim()));
        return str.slice(closingBracketIndex + 1).trim();
    }
    const numberMatch = str.match(/^\d+/);
    if (numberMatch) {
        tokenList.push(expressionFactory.getIntExpression(parseInt(numberMatch[0], 10)));
        return str.slice(numberMatch[0].length).trim();
    }
    const stringMatch = str.match(/^'\d+'/);
    if (stringMatch) {
        tokenList.push(expressionFactory.getIndexedStringExpression(stringMatch[0]));
        return str.slice(stringMatch[0].length).trim();
    }
    const opMatch = str.match(/^(?:MOD|AND|OBJ|LOC|OR|NO|<>|<=|>=|=<|=>|\+|-|\*|\/|!|=|<|>|&)/);
    if (opMatch) {
        tokenList.push(expressionFactory.getOperatorExpression(opMatch[0]));
        return str.slice(opMatch[0].length).trim();
    }
    const wordMatch = str.match(/^[^!:&=<>+*/,'"(){}\-\[\]\s]+/);
    if (wordMatch) {
        let length = wordMatch[0].length;
        const funcObject = keywordManager.findFunction(wordMatch[0]);
        if (funcObject) {
            let argExpressions;
            const nextSymbolIndex = syntaxUtils.findNonEmptySymbol(str, length);
            if (nextSymbolIndex < 0 || str.charAt(nextSymbolIndex) !== '(') {
                argExpressions = [];
            } else {
                const closingBracket = syntaxUtils.findBracket(str, nextSymbolIndex);
                length = closingBracket + 1;
                const args = syntaxUtils.splitArguments(str.slice(nextSymbolIndex + 1, closingBracket).trim());
                if (args.length < funcObject.minArgs || funcObject.maxArgs >= 0 && args.length > funcObject.maxArgs)
                    throw new Error(ERROR_MSG.INVALID_ARG_COUNT(funcObject.name));
                argExpressions = args.map(x => parseFunc(x));
            }
            tokenList.push(expressionFactory.getFunctionExpression(funcObject.name, argExpressions));
        } else {
            let indexer = '';
            if (str.charAt(length) === '[') {
                const closingIndex = syntaxUtils.findBracket(str, length);
                indexer = str.slice(length, closingIndex + 1);
                length = closingIndex + 1;
            }
            tokenList.push(variableParser.parseGetVariable(wordMatch[0], indexer, parseFunc));
        }
        return str.slice(length).trim();
    }
    throw new Error(ERROR_MSG.INVALID_EXPR);
};

const parseExpression = expr => {
    const tokens = [];
    let str = expr;
    while (str)
        str = readToken(str, tokens, parseExpression);
    return exprTreeBuilder.getExpressionTree(tokens);
};

exports.parseExpression = parseExpression;
