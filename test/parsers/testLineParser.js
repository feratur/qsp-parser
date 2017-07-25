const lineParser = require('../../src/parsers/lineParser');

const chai = require('chai');
const {describe, it} = require('mocha');
const dirtyChai = require('dirty-chai');
const {expect} = chai;

chai.use(dirtyChai);

describe('lineParser', () => {
    describe('parseLine', () => {
        it('throws on single \':\' symbol', () => {
            const test = () => lineParser.parseLine(':', 0, [], {});
            expect(test).to.throw();
        });
        it('works with labels', () => {
            const label = 'TEST_LABEL';
            const lineIndex = 42;
            const labels = {};
            const result = lineParser.parseLine(': ' + label, lineIndex, [], labels);
            expect(result).to.be.null();
            expect(labels[label]).to.equal(lineIndex);
        });
        it('prints by default', () => {
            const result = lineParser.parseLine('+2', 1, [], {});
            const expectedResult = {
                "name": "*PL",
                "args": [{"isAtom": false, "value": {"name": "__U_PLUS__", "args": [{"isAtom": true, "value": 2}]}}]
            };
            expect(result).to.deep.equal(expectedResult);
        });
        it('throws on invalid \'LET/SET\' statement', () => {
            const test = () => lineParser.parseLine('LET TEST', 0, [], {});
            expect(test).to.throw();
        });
        it('works with valid \'LET/SET\' statement', () => {
            const result = lineParser.parseLine('LET VAR=42', 1, [], {});
            const expectedResult = {
                "name": "__SET_VAR__",
                "args": [
                    {"isAtom": true, "value": -1},
                    {"isAtom": true, "value": 0},
                    {"isAtom": true, "value": 42},
                    {"isAtom": true, "value": 86},
                    {"isAtom": true, "value": 65},
                    {"isAtom": true, "value": 82}
                ]
            };
            expect(result).to.deep.equal(expectedResult);
        });
        it('throws on invalid \'ACT/IF\' statement (missing \':\')', () => {
            const test = () => lineParser.parseLine('IF 2=2', 0, [], {});
            expect(test).to.throw();
        });
        it('works with valid \'IF\' statement', () => {
            const blockStack = [];
            const lineIndex = 42;
            const result = lineParser.parseLine('IF 1:', lineIndex, blockStack, {});
            const expectedResult = {
                "name": "__IF__",
                "args": [
                    {
                        "isAtom": true,
                        "value": 1
                    },
                    {
                        "isAtom": true,
                        "value": lineIndex + 1
                    }
                ]
            };
            expect(blockStack).to.have.lengthOf(1);
            expect(blockStack[0].cmdName).to.equal('IF');
            expect(blockStack[0].cmdObj).to.equal(result);
            expect(result).to.deep.equal(expectedResult);
        });
        it('works with valid \'ACT\' statement', () => {
            const blockStack = [];
            const lineIndex = 42;
            const result = lineParser.parseLine('ACT \'1\':', lineIndex, blockStack, {});
            const expectedResult = {
                "name": "__ACT__",
                "args": [
                    {
                        "isAtom": false,
                        "value": {
                            "name": "__GET_STR__",
                            "args": [
                                {
                                    "isAtom": true,
                                    "value": 1
                                }
                            ]
                        }
                    }
                ]
            };
            expect(blockStack).to.have.lengthOf(1);
            expect(blockStack[0].cmdName).to.equal('ACT');
            expect(blockStack[0].cmdObj).to.equal(result);
            expect(result).to.deep.equal(expectedResult);
        });
        it('throws on invalid \'ELSE/ELSEIF\' statement position', () => {
            const test1 = () => lineParser.parseLine('ELSEIF 2=2:', 0, [], {});
            const test2 = () => lineParser.parseLine('ELSE', 0, [{cmdName: 'ACT'}], {});
            expect(test1).to.throw();
            expect(test2).to.throw();
        });
        it('throws on invalid \'ELSEIF\' statement (missing \':\')', () => {
            const test = () => lineParser.parseLine('ELSEIF 2=2', 0, [{cmdName: 'IF'}], {});
            expect(test).to.throw();
        });
        it('works with valid \'ELSEIF\' statement', () => {
            const lineIndex = 42;
            const prevCmd = {
                cmdName: 'IF',
                cmdObj: {
                    "name": "__IF__",
                    "args": [{"isAtom": true, "value": 1}, {"isAtom": true, "value": lineIndex + 1}]
                }
            };
            const blockStack = [prevCmd];
            const result = lineParser.parseLine('ELSEIF 1:', lineIndex + 1, blockStack, {});
            const expectedPrevCmd = {
                "name": "__IF__",
                "args": [
                    {"isAtom": true, "value": 1},
                    {"isAtom": true, "value": lineIndex + 1},
                    {"isAtom": true, "value": 1},
                    {"isAtom": true, "value": lineIndex + 2}
                ]
            };
            const expectedResult = {
                "name": "__JUMP_TO_LINE__",
                "args": []
            };
            expect(blockStack[blockStack.length - 2]).to.equal(prevCmd);
            expect(blockStack[blockStack.length - 1].cmdName).to.equal('ELSEIF');
            expect(blockStack[blockStack.length - 1].cmdObj).to.equal(result);
            expect(prevCmd.cmdObj).to.deep.equal(expectedPrevCmd);
            expect(result).to.deep.equal(expectedResult);
        });
        it('works with valid \'ELSE\' statement', () => {
            const lineIndex = 42;
            const prevCmd = {
                cmdName: 'IF',
                cmdObj: {
                    "name": "__IF__",
                    "args": [{"isAtom": true, "value": 1}, {"isAtom": true, "value": lineIndex + 1}]
                }
            };
            const blockStack = [prevCmd];
            const result = lineParser.parseLine('ELSE', lineIndex + 1, blockStack, {});
            const expectedPrevCmd = {
                "name": "__IF__",
                "args": [
                    {"isAtom": true, "value": 1},
                    {"isAtom": true, "value": lineIndex + 1},
                    {"isAtom": true, "value": lineIndex + 2}
                ]
            };
            const expectedResult = {
                "name": "__JUMP_TO_LINE__",
                "args": []
            };
            expect(blockStack[blockStack.length - 2]).to.equal(prevCmd);
            expect(blockStack[blockStack.length - 1].cmdName).to.equal('ELSE');
            expect(blockStack[blockStack.length - 1].cmdObj).to.equal(result);
            expect(prevCmd.cmdObj).to.deep.equal(expectedPrevCmd);
            expect(result).to.deep.equal(expectedResult);
        });
        it('throws on invalid \'ELSE\' statement (redundant symbols)', () => {
            const test = () => lineParser.parseLine('ELSE :', 0, [{cmdName: 'IF'}], {});
            expect(test).to.throw();
        });
        it('throws on invalid \'END\' statement position', () => {
            const test = () => lineParser.parseLine('END', 0, [], {});
            expect(test).to.throw();
        });
        it('throws on invalid \'END IF\' statement (redundant symbols)', () => {
            const test = () => lineParser.parseLine('END  IF:', 0, [{cmdName: 'IF'}], {});
            expect(test).to.throw();
        });
        it('throws on \'END IF\' after \'ACT\' statement', () => {
            const test = () => lineParser.parseLine('END IF', 0, [{cmdName: 'ACT'}], {});
            expect(test).to.throw();
        });
        it('works with valid \'END\' after \'ACT\' statement', () => {
            const lineIndex = 42;
            const prevCmd = {
                "name": "__ACT__",
                "args": [{"isAtom": false, "value": {"name": "__GET_STR__", "args": [{"isAtom": true, "value": 1}]}}]
            };
            const blockStack = [{cmdName: 'ACT', cmdObj: prevCmd}];
            const result = lineParser.parseLine('END', lineIndex + 1, blockStack, {});
            const expectedArg = {
                "isAtom": true,
                "value": lineIndex + 1
            };
            expect(blockStack).to.be.empty();
            expect(result).to.be.null();
            expect(prevCmd.args[1]).to.deep.equal(expectedArg);
        });
        it('works with valid \'END IF\' after \'IF/ELSEIF\' statement', () => {
            const lineIndex = 42;
            const blockStack = [{
                "cmdName": "IF",
                "cmdObj": {
                    "name": "__IF__",
                    "args": [
                        {"isAtom": true, "value": 1},
                        {"isAtom": true, "value": 43},
                        {"isAtom": true, "value": 2},
                        {"isAtom": true, "value": 44}
                    ]
                }
            }, {"cmdName": "ELSEIF", "cmdObj": {"name": "__JUMP_TO_LINE__", "args": []}}];
            const ifStatement = blockStack[0].cmdObj;
            const elseIfStatement = blockStack[1].cmdObj;
            const expectedArg = {
                "isAtom": true,
                "value": lineIndex + 2
            };
            const result = lineParser.parseLine('END IF', lineIndex + 2, blockStack, {});
            expect(result).to.be.null();
            expect(blockStack).to.be.empty();
            expect(ifStatement.args[4]).to.deep.equal(elseIfStatement.args[0]);
            expect(ifStatement.args[4]).to.deep.equal(expectedArg);
        });
        it('works with valid command', () => {
            const value = 42;
            const result = lineParser.parseLine(`*PL (${value})`, 0, [], {});
            const expectedResult = {
                "name": "*PL",
                "args": [
                    {
                        "isAtom": true,
                        "value": value
                    }
                ]
            };
            expect(result).to.deep.equal(expectedResult);
        });
        it('works with var assignment without \'LET/SET\'', () => {
            const value = 42;
            const result = lineParser.parseLine('VAR = ' + value, 0, [], {});
            const expectedResult = {
                "name": "__SET_VAR__",
                "args": [
                    {"isAtom": true, "value": -1},
                    {"isAtom": true, "value": 0},
                    {"isAtom": true, "value": value},
                    {"isAtom": true, "value": 86},
                    {"isAtom": true, "value": 65},
                    {"isAtom": true, "value": 82}
                ]
            };
            expect(result).to.deep.equal(expectedResult);
        });
        it('prints if no other option found', () => {
            const value = 42;
            const result = lineParser.parseLine('$CURLOC = ' + value, 0, [], {});
            const expectedResult = {
                "name": "*PL",
                "args": [
                    {
                        "isAtom": false,
                        "value": {
                            "name": "__EQ__",
                            "args": [
                                {
                                    "isAtom": false,
                                    "value": {
                                        "name": "CURLOC",
                                        "args": []
                                    }
                                },
                                {
                                    "isAtom": true,
                                    "value": value
                                }
                            ]
                        }
                    }
                ]
            };
            expect(result).to.deep.equal(expectedResult);
        });
    });
});
