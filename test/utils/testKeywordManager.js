const keywordManager = require('../../src/utils/keywordManager');

const chai = require('chai');
const {describe, it} = require('mocha');
const dirtyChai = require('dirty-chai');
const {expect} = chai;

chai.use(dirtyChai);

describe('keywordManager', () => {
    describe('findFunction', () => {
        it('works as intended', () => {
            const result = keywordManager.findFunction('$ARRCOMP');
            expect(result.name).to.equal('ARRCOMP');
        });
        it('returns null for non-existing function', () => {
            const result = keywordManager.findFunction('TESTNULL');
            expect(result).to.be.null();
        });
        it('throws when command name passed', () => {
            const test = () => keywordManager.findFunction('CLOSE');
            expect(test).to.throw();
        });
        it('throws when QSP keyword passed', () => {
            const test = () => keywordManager.findFunction('IF');
            expect(test).to.throw();
        });
        it('throws when single \'$\' character passed', () => {
            const test = () => keywordManager.findFunction('$');
            expect(test).to.throw();
        });
    });
    describe('findCommand', () => {
        it('works with single-word command', () => {
            const result = keywordManager.findCommand('ADDLIB', 'ADDLIB ()');
            expect(result.match).to.equal('ADDLIB');
            expect(result.command.name).to.equal('ADDLIB');
        });
        it('works with multi-word command', () => {
            const result = keywordManager.findCommand('CLOSE', 'CLOSE   ALL');
            expect(result.match).to.equal('CLOSE   ALL');
            expect(result.command.name).to.equal('CLOSE ALL');
        });
        it('returns null for non-existing command', () => {
            const result = keywordManager.findCommand('TEST', 'TEST   ALL');
            expect(result).to.be.null();
        });
        it('returns null for non-matching multi-word command', () => {
            const result = keywordManager.findCommand('DEL', 'DEL   ALL');
            expect(result).to.be.null();
        });
    });
});
