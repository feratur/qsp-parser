const ERROR_MSG = require('../constants/ERROR_MSG');
const QspCommand = require('../classes/QspCommand');
const syntaxUtils = require('../utils/syntaxUtils');
const keywordManager = require('../utils/keywordManager');
const expressionFactory = require('../utils/expressionFactory');

const tryParseVarAssignment = str => {
    const varName = str.match(/^[^!&=<>+*/,'":(){}\-\[\]\s]+/);
    if (!varName)
        return null;
    let indexer = '';
    if (str.charAt(varName[0].length) === '[') {
        const closingIndex = syntaxUtils.findBracket(str, varName[0].length);
        indexer = str.slice(varName[0].length, closingIndex + 1);
    }
    const symbolIndex = syntaxUtils.findNonEmptySymbol(str, varName[0].length + indexer.length);
    if (symbolIndex < 0)
        return null;
    let eqSymbol = '=';
    switch (str.charAt(symbolIndex)) {
        case '=':
            break;
        case '+':
        case '-':
        case '*':
        case '/':
            if (str.charAt(symbolIndex + 1) !== '=')
                return null;
            eqSymbol = str.charAt(symbolIndex) + '=';
            break;
        default:
            return null;
    }
    const tail = str.slice(symbolIndex + eqSymbol.length).trim();
    return {
        varName: varName[0],
        indexer: indexer,
        eqSymbol: eqSymbol,
        tail: tail
    };
};

const getVarInfo = varName => {
    let name = varName;
    let isInt = true;
    if (varName.charAt(0) === '$') {
        name = varName.slice(1);
        isInt = false;
    }
    return {name: name, isInt: isInt};
};

const writeStringAsExpressions = (str, exprList) => {
    for (let i = 0; i < str.length; ++i)
        exprList.push(expressionFactory.getIntExpression(str.charCodeAt(i)));
};

const parseSetVariable = (str, parseFunc) => {
    const assignment = tryParseVarAssignment(str);
    if (!assignment)
        return null;
    if (keywordManager.findFunction(assignment.varName))
        throw new Error(ERROR_MSG.INVALID_VAR_NAME(assignment.varName));
    let indexerExpr;
    if (assignment.indexer) {
        const innerExpr = assignment.indexer.slice(1, -1).trim();
        indexerExpr = innerExpr ? parseFunc(innerExpr) : expressionFactory.getIntExpression(-1);
    } else {
        indexerExpr = expressionFactory.getIntExpression(0);
    }
    let valueExpr;
    if (assignment.eqSymbol.length > 1) {
        const exprString =
            `${assignment.varName + assignment.indexer + assignment.eqSymbol.charAt(0)}(${assignment.tail})`;
        valueExpr = parseFunc(exprString);
    } else {
        valueExpr = parseFunc(assignment.tail);
    }
    const varInfo = getVarInfo(assignment.varName);
    const result = new QspCommand('__SET_VAR__', [
        varInfo.isInt ? expressionFactory.getIntExpression(-1) : expressionFactory.getIntExpression(0),
        indexerExpr,
        valueExpr
    ]);
    writeStringAsExpressions(varInfo.name, result.args);
    return result;
};

const parseGetVariable = (varName, indexer, parseFunc) => {
    const varInfo = getVarInfo(varName);
    let indexerExpr;
    if (indexer) {
        const innerExpr = indexer.slice(1, -1).trim();
        indexerExpr = innerExpr ? parseFunc(innerExpr) : expressionFactory.getIntExpression(-1);
    } else {
        indexerExpr = expressionFactory.getIntExpression(0);
    }
    const result = expressionFactory.getFunctionExpression('__GET_VAR__', [
        varInfo.isInt ? expressionFactory.getIntExpression(-1) : expressionFactory.getIntExpression(0),
        indexerExpr
    ]);
    writeStringAsExpressions(varInfo.name, result.args);
    return result;
};

exports.parseSetVariable = parseSetVariable;
exports.parseGetVariable = parseGetVariable;
