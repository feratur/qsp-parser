const expressionParser = require('../../src/parsers/expressionParser');

const chai = require('chai');
const {describe, it} = require('mocha');
const dirtyChai = require('dirty-chai');
const {expect} = chai;

chai.use(dirtyChai);

describe('expressionParser', () => {
    describe('parseExpression', () => {
        it('throws on unknown symbol', () => {
            const test = () => expressionParser.parseExpression('2:3');
            expect(test).to.throw();
        });
        it('throws on too many function args', () => {
            const test = () => expressionParser.parseExpression('CURLOC(42)');
            expect(test).to.throw();
        });
        it('throws on too few function args', () => {
            const test = () => expressionParser.parseExpression('$STR()');
            expect(test).to.throw();
        });
        it('works with variables', () => {
            const result = expressionParser.parseExpression('VAR[42]');
            const expectedResult = {
                "isAtom": false,
                "value": {
                    "name": "__GET_VAR__",
                    "args": [
                        {"isAtom": true, "value": -1},
                        {"isAtom": true, "value": 42},
                        {"isAtom": true, "value": 86},
                        {"isAtom": true, "value": 65},
                        {"isAtom": true, "value": 82}
                    ]
                }
            };
            expect(result).to.deep.equal(expectedResult);
        });
        it('works with functions without parenthesis', () => {
            const result = expressionParser.parseExpression('$CURLOC');
            const expectedResult = {"isAtom": false, "value": {"name": "CURLOC", "args": []}};
            expect(result).to.deep.equal(expectedResult);
        });
        it('works with functions with parenthesis', () => {
            const result = expressionParser.parseExpression('CURLOC()');
            const expectedResult = {"isAtom": false, "value": {"name": "CURLOC", "args": []}};
            expect(result).to.deep.equal(expectedResult);
        });
        it('works with parenthesis', () => {
            const result = expressionParser.parseExpression('2*(2+2)');
            const expectedResult = {"isAtom": false,
                "value": {
                    "name": "__MULT__",
                    "args": [{"isAtom": true, "value": 2}, {"isAtom": false,
                        "value": {
                            "name": "__PLUS__",
                            "args": [{"isAtom": true, "value": 2}, {"isAtom": true, "value": 2}]
                        }
                    }]
                }
            };
            expect(result).to.deep.equal(expectedResult);
        });
        it('works with numbers, strings and operators', () => {
            const result = expressionParser.parseExpression('2 MOD \'1\'');
            const expectedResult = {
                "isAtom": false,
                "value": {
                    "name": "__MOD__",
                    "args": [{"isAtom": true, "value": 2}, {
                        "isAtom": false,
                        "value": {"name": "__GET_STR__", "args": [{"isAtom": true, "value": 1}]}
                    }]
                }
            };
            expect(result).to.deep.equal(expectedResult);
        });
    });
});
