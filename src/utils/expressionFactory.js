const QspExpression = require('../classes/QspExpression');
const QspFunction = require('../classes/QspFunction');

const getIntExpression = value => {
    return new QspExpression(true, value);
};

const getOperatorExpression = value => {
    return new QspExpression(true, value);
};

const getFunctionExpression = (funcName, args) => {
    return new QspExpression(false, new QspFunction(funcName, args));
};

const getIndexedStringExpression = str => {
    const stringIndex = getIntExpression(parseInt(str.slice(1, -1), 10));
    return getFunctionExpression('__GET_STR__', [stringIndex]);
};

exports.getIntExpression = getIntExpression;
exports.getOperatorExpression = getOperatorExpression;
exports.getFunctionExpression = getFunctionExpression;
exports.getIndexedStringExpression = getIndexedStringExpression;
