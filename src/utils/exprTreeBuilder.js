const ERROR_MSG = require('../constants/ERROR_MSG');
const SUB_EXPRESSION_TYPE = require('../constants/SUB_EXPRESSION_TYPE');
const expressionFactory = require('./expressionFactory');

const operators = {
    '+': { isBinary: true, priority: 6, funcName: '__PLUS__' },
    '-': { isBinary: true, priority: 6, funcName: '__MINUS__' },
    '*': { isBinary: true, priority: 8, funcName: '__MULT__' },
    '/': { isBinary: true, priority: 8, funcName: '__DIV__' },
    '&': { isBinary: true, priority: 5, funcName: '__CONC__' },
    'MOD': { isBinary: true, priority: 7, funcName: '__MOD__' },
    'OR': { isBinary: true, priority: 1, funcName: '__OR__' },
    'AND': { isBinary: true, priority: 2, funcName: '__AND__' },
    '=': { isBinary: true, priority: 4, funcName: '__EQ__' },
    '<': { isBinary: true, priority: 4, funcName: '__LT__' },
    '>': { isBinary: true, priority: 4, funcName: '__GT__' },
    '!': { isBinary: true, priority: 4, funcName: '__NE__' },
    '<>': { isBinary: true, priority: 4, funcName: '__NE__' },
    '<=': { isBinary: true, priority: 4, funcName: '__LE__' },
    '>=': { isBinary: true, priority: 4, funcName: '__GE__' },
    '=<': { isBinary: true, priority: 4, funcName: '__LE__' },
    '=>': { isBinary: true, priority: 4, funcName: '__GE__'},
    'OBJ': { isBinary: false, priority: 3, funcName: '__OBJ__' },
    'LOC': { isBinary: false, priority: 3, funcName: '__LOC__', },
    'NO': { isBinary: false, priority: 3, funcName: '__NO__' },
    'u+': { isBinary: false, priority: 9, funcName: '__U_PLUS__' },
    'u-': { isBinary: false, priority: 9, funcName: '__U_MINUS__' }
};

const addAsUnaryOperator = (op, opList) => {
    if (op.value === '+') {
        opList.push(expressionFactory.getOperatorExpression('u+'));
    } else if (op.value === '-') {
        opList.push(expressionFactory.getOperatorExpression('u-'));
    } else if (operators[op.value].isBinary) {
        throw new Error(ERROR_MSG.INVALID_OP_ORDER);
    } else {
        opList.push(op);
    }
};

const isOperator = expr => expr.type === SUB_EXPRESSION_TYPE.OPERATOR;

const validateTokenOrder = tokens => {
    const firstToken = tokens[0];
    const result = [];
    if (isOperator(firstToken)) {
        addAsUnaryOperator(firstToken, result);
    } else {
        result.push(firstToken);
    }
    for (let i = 1; i < tokens.length; ++i) {
        const token = tokens[i];
        const prevToken = tokens[i - 1];
        const isCurOp = isOperator(token);
        const isPrevOp = isOperator(prevToken);
        if (!isCurOp && !isPrevOp)
            throw new Error(ERROR_MSG.INVALID_OP_ORDER);
        if (!isCurOp && isPrevOp) {
            result.push(token);
        } else if (isCurOp && !isPrevOp) {
            if (!operators[token.value].isBinary)
                throw new Error(ERROR_MSG.INVALID_OP_ORDER);
            result.push(token);
        } else {
            addAsUnaryOperator(token, result);
        }
    }
    if (isOperator(result[result.length - 1]))
        throw new Error(ERROR_MSG.INVALID_OP_ORDER);
    return result;
};

const arrangeRpnOrder = tokens => {
    const result = [];
    const opStack = [];
    for (const token of tokens) {
        if (!isOperator(token)) {
            result.push(token);
        } else {
            const curOp = operators[token.value];
            while (opStack.length > 0) {
                const lastOp = operators[opStack[opStack.length - 1].value];
                if (curOp.isBinary && curOp.priority > lastOp.priority)
                    break;
                if (!curOp.isBinary && curOp.priority >= lastOp.priority)
                    break;
                result.push(opStack.pop());
            }
            opStack.push(token);
        }
    }
    while (opStack.length > 0) {
        result.push(opStack.pop());
    }
    return result;
};

const buildTree = function buildTree(rootNode, tokens) {
    const op = operators[rootNode.value];
    if (op.isBinary) {
        const secondArgToken = tokens.pop();
        const secondArg = isOperator(secondArgToken) ? buildTree(secondArgToken, tokens) : secondArgToken;
        const firstArgToken = tokens.pop();
        const firstArg = isOperator(firstArgToken) ? buildTree(firstArgToken, tokens) : firstArgToken;
        return expressionFactory.getFunctionExpression(op.funcName, [firstArg, secondArg]);
    }
    const arg = tokens.pop();
    const realArg = isOperator(arg) ? buildTree(arg, tokens) : arg;
    return expressionFactory.getFunctionExpression(op.funcName, [realArg]);
};

exports.getExpressionTree = tokens => {
    if (tokens.length === 0)
        throw new Error(ERROR_MSG.EMPTY_EXPR);
    if (tokens.length === 1 && !isOperator(tokens[0]))
        return tokens[0];
    const validatedTokens = validateTokenOrder(tokens);
    const rpnTokens = arrangeRpnOrder(validatedTokens);
    return buildTree(rpnTokens.pop(), rpnTokens);
};
