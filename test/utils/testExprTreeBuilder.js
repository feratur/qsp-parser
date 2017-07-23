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
            const expected =
                '{\n' +
                '  "isAtom": false,\n' +
                '  "value": {\n' +
                '    "name": "__OR__",\n' +
                '    "args": [\n' +
                '      {\n' +
                '        "isAtom": false,\n' +
                '        "value": {\n' +
                '          "name": "__PLUS__",\n' +
                '          "args": [\n' +
                '            {\n' +
                '              "isAtom": false,\n' +
                '              "value": {\n' +
                '                "name": "__PLUS__",\n' +
                '                "args": [\n' +
                '                  {\n' +
                '                    "isAtom": false,\n' +
                '                    "value": {\n' +
                '                      "name": "__U_PLUS__",\n' +
                '                      "args": [\n' +
                '                        {\n' +
                '                          "isAtom": true,\n' +
                '                          "value": 1\n' +
                '                        }\n' +
                '                      ]\n' +
                '                    }\n' +
                '                  },\n' +
                '                  {\n' +
                '                    "isAtom": false,\n' +
                '                    "value": {\n' +
                '                      "name": "__DIV__",\n' +
                '                      "args": [\n' +
                '                        {\n' +
                '                          "isAtom": true,\n' +
                '                          "value": 2\n' +
                '                        },\n' +
                '                        {\n' +
                '                          "isAtom": true,\n' +
                '                          "value": 3\n' +
                '                        }\n' +
                '                      ]\n' +
                '                    }\n' +
                '                  }\n' +
                '                ]\n' +
                '              }\n' +
                '            },\n' +
                '            {\n' +
                '              "isAtom": false,\n' +
                '              "value": {\n' +
                '                "name": "__MULT__",\n' +
                '                "args": [\n' +
                '                  {\n' +
                '                    "isAtom": true,\n' +
                '                    "value": 2\n' +
                '                  },\n' +
                '                  {\n' +
                '                    "isAtom": false,\n' +
                '                    "value": {\n' +
                '                      "name": "__NO__",\n' +
                '                      "args": [\n' +
                '                        {\n' +
                '                          "isAtom": false,\n' +
                '                          "value": {\n' +
                '                            "name": "__PLUS__",\n' +
                '                            "args": [\n' +
                '                              {\n' +
                '                                "isAtom": false,\n' +
                '                                "value": {\n' +
                '                                  "name": "__U_MINUS__",\n' +
                '                                  "args": [\n' +
                '                                    {\n' +
                '                                      "isAtom": true,\n' +
                '                                      "value": 2\n' +
                '                                    }\n' +
                '                                  ]\n' +
                '                                }\n' +
                '                              },\n' +
                '                              {\n' +
                '                                "isAtom": true,\n' +
                '                                "value": 2\n' +
                '                              }\n' +
                '                            ]\n' +
                '                          }\n' +
                '                        }\n' +
                '                      ]\n' +
                '                    }\n' +
                '                  }\n' +
                '                ]\n' +
                '              }\n' +
                '            }\n' +
                '          ]\n' +
                '        }\n' +
                '      },\n' +
                '      {\n' +
                '        "isAtom": true,\n' +
                '        "value": 1\n' +
                '      }\n' +
                '    ]\n' +
                '  }\n' +
                '}';
            const expectedObj = JSON.parse(expected);
            expect(result).to.deep.equal(expectedObj);
        });
    });
});
