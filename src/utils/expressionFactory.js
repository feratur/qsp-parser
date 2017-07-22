const EXPRESSION_TYPE = require('../constants/EXPRESSION_TYPE');
const QspExpression = require('../classes/QspExpression');
const QspFunction = require('../classes/QspFunction');

const getIntExpression = value => {
    return new QspExpression(EXPRESSION_TYPE.INTEGER, value);
};

const getRawStringExpression = value => {
    return new QspExpression(EXPRESSION_TYPE.STRING, value);
};

const getOperatorExpression = value => {
    return new QspExpression(EXPRESSION_TYPE.OPERATOR, value);
};

const getFunctionExpression = (funcName, args) => {
    return new QspExpression(EXPRESSION_TYPE.FUNCTION, new QspFunction(funcName, args));
};

const getIndexedStringExpression = str => {
    const stringIndex = getIntExpression(parseInt(str.slice(1, -1), 10));
    return getFunctionExpression('__GET_STR__', [stringIndex]);
};

exports.getIntExpression = getIntExpression;
exports.getRawStringExpression = getRawStringExpression;
exports.getOperatorExpression = getOperatorExpression;
exports.getFunctionExpression = getFunctionExpression;
exports.getIndexedStringExpression = getIndexedStringExpression;
