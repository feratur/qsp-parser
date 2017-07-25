const exprTreeBuilder = require('../../src/utils/exprTreeBuilder');
const expressionFactory = require('../../src/utils/expressionFactory');

const chai = require('chai');
const {describe, it} = require('mocha');
const dirtyChai = require('dirty-chai');
const {expect} = chai;

chai.use(dirtyChai);

describe('exprTreeBuilder', () => {
    describe('getExpressionTree', () => {
        it('throws on empty input', () => {
            const test = () => exprTreeBuilder.getExpressionTree([]);
            expect(test).to.throw();
        });
        it('returns single non-operator token', () => {
            const result = exprTreeBuilder.getExpressionTree([expressionFactory.getIntExpression(42)]);
            expect(result.isAtom).to.be.true();
            expect(result.value).to.equal(42);
        });
        it('throws on invalid token order', () => {
            const test1 = () => exprTreeBuilder.getExpressionTree([expressionFactory.getOperatorExpression('AND')]);
            const test2 = () => exprTreeBuilder.getExpressionTree([
                expressionFactory.getIntExpression(1),
                expressionFactory.getIntExpression(2)
            ]);
            const test3 = () => exprTreeBuilder.getExpressionTree([
                expressionFactory.getIntExpression(1),
                expressionFactory.getOperatorExpression('NO')
            ]);
            const test4 = () => exprTreeBuilder.getExpressionTree([
                expressionFactory.getIntExpression(1),
                expressionFactory.getOperatorExpression('AND')
            ]);
            expect(test1).to.throw();
            expect(test2).to.throw();
            expect(test3).to.throw();
            expect(test4).to.throw();
        });
        it('works as intended', () => {
            const result = exprTreeBuilder.getExpressionTree([
                expressionFactory.getOperatorExpression('+'),
                expressionFactory.getIntExpression(1),
                expressionFactory.getOperatorExpression('+'),
                expressionFactory.getIntExpression(2),
                expressionFactory.getOperatorExpression('/'),
                expressionFactory.getIntExpression(3),
                expressionFactory.getOperatorExpression('+'),
                expressionFactory.getIntExpression(2),
                expressionFactory.getOperatorExpression('*'),
                expressionFactory.getOperatorExpression('NO'),
                expressionFactory.getOperatorExpression('-'),
                expressionFactory.getIntExpression(2),
                expressionFactory.getOperatorExpression('+'),
                expressionFactory.getIntExpression(2),
                expressionFactory.getOperatorExpression('OR'),
                expressionFactory.getIntExpression(1),
            ]);
            const expectedObj = {
                "isAtom": false,
                "value": {
                    "name": "__OR__",
                    "args": [{
                        "isAtom": false,
                        "value": {
                            "name": "__PLUS__",
                            "args": [{
                                "isAtom": false,
                                "value": {
                                    "name": "__PLUS__",
                                    "args": [{
                                        "isAtom": false,
                                        "value": {"name": "__U_PLUS__", "args": [{"isAtom": true, "value": 1}]}
                                    }, {
                                        "isAtom": false,
                                        "value": {
                                            "name": "__DIV__",
                                            "args": [{"isAtom": true, "value": 2}, {"isAtom": true, "value": 3}]
                                        }
                                    }]
                                }
                            }, {
                                "isAtom": false,
                                "value": {
                                    "name": "__MULT__",
                                    "args": [{"isAtom": true, "value": 2}, {
                                        "isAtom": false,
                                        "value": {
                                            "name": "__NO__",
                                            "args": [{
                                                "isAtom": false,
                                                "value": {
                                                    "name": "__PLUS__",
                                                    "args": [{
                                                        "isAtom": false,
                                                        "value": {
                                                            "name": "__U_MINUS__",
                                                            "args": [{"isAtom": true, "value": 2}]
                                                        }
                                                    }, {"isAtom": true, "value": 2}]
                                                }
                                            }]
                                        }
                                    }]
                                }
                            }]
                        }
                    }, {"isAtom": true, "value": 1}]
                }
            };
            expect(result).to.deep.equal(expectedObj);
        });
    });
});
