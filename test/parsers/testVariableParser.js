const variableParser = require('../../src/parsers/variableParser');
const expressionParser = require('../../src/parsers/expressionParser');
const expressionFactory = require('../../src/utils/expressionFactory');

const chai = require('chai');
const {describe, it} = require('mocha');
const dirtyChai = require('dirty-chai');
const {expect} = chai;

chai.use(dirtyChai);

describe('variableParser', () => {
    describe('parseSetVariable', () => {
        it('returns null if parsing fails', () => {
            const result1 = variableParser.parseSetVariable('TEST+1', expressionParser.parseExpression);
            const result2 = variableParser.parseSetVariable('+1', expressionParser.parseExpression);
            const result3 = variableParser.parseSetVariable('TEST', expressionParser.parseExpression);
            const result4 = variableParser.parseSetVariable('TEST > 0', expressionParser.parseExpression);
            expect(result1).to.be.null();
            expect(result2).to.be.null();
            expect(result3).to.be.null();
            expect(result4).to.be.null();
        });
        it('non-indexed int assignment works', () => {
            const varName = 'TEST';
            const intValue = 42;
            const result =
                variableParser.parseSetVariable(varName + ' = ' + intValue, expressionParser.parseExpression);
            let resultVarName = '';
            for (let i = 3; i < result.args.length; ++i) {
                resultVarName += String.fromCharCode(result.args[i].value);
            }
            expect(result.name).to.equal('__SET_VAR__');
            expect(result.args[0]).to.deep.equal(expressionFactory.getIntExpression(-1));
            expect(result.args[1]).to.deep.equal(expressionFactory.getIntExpression(0));
            expect(result.args[2]).to.deep.equal(expressionFactory.getIntExpression(intValue));
            expect(resultVarName).to.equal(varName);
        });
        it('non-indexed string assignment works', () => {
            const varName = 'TEST';
            const intValue = 42;
            const result =
                variableParser.parseSetVariable('$' + varName + ' = ' + intValue, expressionParser.parseExpression);
            let resultVarName = '';
            for (let i = 3; i < result.args.length; ++i) {
                resultVarName += String.fromCharCode(result.args[i].value);
            }
            expect(result.name).to.equal('__SET_VAR__');
            expect(result.args[0]).to.deep.equal(expressionFactory.getIntExpression(0));
            expect(result.args[1]).to.deep.equal(expressionFactory.getIntExpression(0));
            expect(result.args[2]).to.deep.equal(expressionFactory.getIntExpression(intValue));
            expect(resultVarName).to.equal(varName);
        });
        it('indexed assignment works', () => {
            const varName = 'TEST';
            const intValue = 42;
            const result =
                variableParser.parseSetVariable(varName + '[1] = ' + intValue, expressionParser.parseExpression);
            let resultVarName = '';
            for (let i = 3; i < result.args.length; ++i) {
                resultVarName += String.fromCharCode(result.args[i].value);
            }
            expect(result.name).to.equal('__SET_VAR__');
            expect(result.args[0]).to.deep.equal(expressionFactory.getIntExpression(-1));
            expect(result.args[1]).to.deep.equal(expressionFactory.getIntExpression(1));
            expect(result.args[2]).to.deep.equal(expressionFactory.getIntExpression(intValue));
            expect(resultVarName).to.equal(varName);
        });
        it('last-indexed assignment works', () => {
            const varName = 'TEST';
            const intValue = 42;
            const result =
                variableParser.parseSetVariable(varName + '[] = ' + intValue, expressionParser.parseExpression);
            let resultVarName = '';
            for (let i = 3; i < result.args.length; ++i) {
                resultVarName += String.fromCharCode(result.args[i].value);
            }
            expect(result.name).to.equal('__SET_VAR__');
            expect(result.args[0]).to.deep.equal(expressionFactory.getIntExpression(-1));
            expect(result.args[1]).to.deep.equal(expressionFactory.getIntExpression(-1));
            expect(result.args[2]).to.deep.equal(expressionFactory.getIntExpression(intValue));
            expect(resultVarName).to.equal(varName);
        });
        it('combined assignment works', () => {
            const varName = 'TEST';
            const intValue = 42;
            const result =
                variableParser.parseSetVariable(varName + ' += ' + intValue, expressionParser.parseExpression);
            let resultVarName = '';
            for (let i = 3; i < result.args.length; ++i) {
                resultVarName += String.fromCharCode(result.args[i].value);
            }
            const expectedValue = JSON.parse(`
                {
                  "isAtom": false,
                  "value": {
                    "name": "__PLUS__",
                    "args": [
                      {
                        "isAtom": false,
                        "value": {
                          "name": "__GET_VAR__",
                          "args": [
                            {
                              "isAtom": true,
                              "value": -1
                            },
                            {
                              "isAtom": true,
                              "value": 0
                            },
                            {
                              "isAtom": true,
                              "value": 84
                            },
                            {
                              "isAtom": true,
                              "value": 69
                            },
                            {
                              "isAtom": true,
                              "value": 83
                            },
                            {
                              "isAtom": true,
                              "value": 84
                            }
                          ]
                        }
                      },
                      {
                        "isAtom": true,
                        "value": 42
                      }
                    ]
                  }
                }`);
            expect(result.name).to.equal('__SET_VAR__');
            expect(result.args[0]).to.deep.equal(expressionFactory.getIntExpression(-1));
            expect(result.args[1]).to.deep.equal(expressionFactory.getIntExpression(0));
            expect(result.args[2]).to.deep.equal(expectedValue);
            expect(resultVarName).to.equal(varName);
        });
        it('throws on invalid variable name', () => {
            const test = () => variableParser.parseSetVariable('$ARRCOMP = 42', expressionParser.parseExpression);
            expect(test).to.throw();
        });
    });
    describe('parseGetVariable', () => {
        it('works with non-indexed int variable', () => {
            const varName = 'TEST';
            const result = variableParser.parseGetVariable(varName, '', expressionParser.parseExpression);
            let resultVarName = '';
            for (let i = 2; i < result.value.args.length; ++i) {
                resultVarName += String.fromCharCode(result.value.args[i].value);
            }
            expect(result.isAtom).to.be.false();
            expect(result.value.name).to.equal('__GET_VAR__');
            expect(result.value.args[0]).to.deep.equal(expressionFactory.getIntExpression(-1));
            expect(result.value.args[1]).to.deep.equal(expressionFactory.getIntExpression(0));
            expect(resultVarName).to.equal(varName);
        });
        it('works with indexed string variable', () => {
            const varName = 'TEST';
            const result = variableParser.parseGetVariable('$' + varName, '[1]', expressionParser.parseExpression);
            let resultVarName = '';
            for (let i = 2; i < result.value.args.length; ++i) {
                resultVarName += String.fromCharCode(result.value.args[i].value);
            }
            expect(result.isAtom).to.be.false();
            expect(result.value.name).to.equal('__GET_VAR__');
            expect(result.value.args[0]).to.deep.equal(expressionFactory.getIntExpression(0));
            expect(result.value.args[1]).to.deep.equal(expressionFactory.getIntExpression(1));
            expect(resultVarName).to.equal(varName);
        });
        it('works with last-indexed int variable', () => {
            const varName = 'TEST';
            const result = variableParser.parseGetVariable(varName, '[]', expressionParser.parseExpression);
            let resultVarName = '';
            for (let i = 2; i < result.value.args.length; ++i) {
                resultVarName += String.fromCharCode(result.value.args[i].value);
            }
            expect(result.isAtom).to.be.false();
            expect(result.value.name).to.equal('__GET_VAR__');
            expect(result.value.args[0]).to.deep.equal(expressionFactory.getIntExpression(-1));
            expect(result.value.args[1]).to.deep.equal(expressionFactory.getIntExpression(-1));
            expect(resultVarName).to.equal(varName);
        });
    });
});
