const codeBlockParser = require('../../src/parsers/codeBlockParser');

const chai = require('chai');
const {describe, it} = require('mocha');
const dirtyChai = require('dirty-chai');
const {expect} = chai;

chai.use(dirtyChai);

describe('codeBlockParser', () => {
    describe('parseCodeBlock', () => {
        it('throws on missing \'END\' statement', () => {
            const test = () => codeBlockParser.parseCodeBlock('TEST', ['IF 1:'], [1]);
            expect(test).to.throw();
        });
        it('wraps exception in QspError', () => {
            const test = () => codeBlockParser.parseCodeBlock('TEST', ['*FAIL*'], [1]);
            expect(test).to.throw();
        });
        it('works as intended', () => {
            const inputLines = ['*PL 42', ':label'];
            const result = codeBlockParser.parseCodeBlock('TEST', inputLines, [1, 2]);
            expect(result.commandList).to.have.lengthOf(inputLines.length);
        });
    });
});
