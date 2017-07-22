const syntaxUtils = require('../../src/utils/syntaxUtils');

const chai = require('chai');
const {expect} = chai;

describe('syntaxUtils', () => {
    describe('findBracket', () => {
        it('works as intended', () => {
            const testString = '(te(st))';
            const result = syntaxUtils.findBracket(testString, 0);
            expect(result).to.equal(7);
        });
        it('throws on invalid brackets', () => {
            const testString = '(te(st)';
            expect(() => syntaxUtils.findBracket(testString, 0)).to.throw();
        });
    });
    describe('validateArgCount', () => {
        it('works as intended', () => {
            const test = () => syntaxUtils.validateArgCount([1, 2], 'test', 1, 2);
            expect(test).to.not.throw();
        });
        it('throws if too few args', () => {
            const test = () => syntaxUtils.validateArgCount([1, 2], 'test', 3, -1);
            expect(test).to.throw();
        });
        it('throws if too many args', () => {
            const test = () => syntaxUtils.validateArgCount([1, 2], 'test', 0, 1);
            expect(test).to.throw();
        });
    });
    describe('splitArguments', () => {
        it('works as intended', () => {
            const result = syntaxUtils.splitArguments('a,(b+[c-d]), e');
            expect(result).to.have.lengthOf(3);
            expect(result[0]).to.equal('a');
            expect(result[1]).to.equal('(b+[c-d])');
            expect(result[2]).to.equal('e');
        });
        it('works with empty input', () => {
            const result = syntaxUtils.splitArguments('');
            expect(result).to.be.empty;
        });
        it('throws on invalid input', () => {
            const test1 = () => syntaxUtils.splitArguments('a,,b');
            const test2 = () => syntaxUtils.splitArguments('a,b, ');
            expect(test1).to.throw();
            expect(test2).to.throw();
        });
    });
    describe('findNonEmptySymbol', () => {
        it('works as intended', () => {
            const result = syntaxUtils.findNonEmptySymbol('a  b', 1);
            expect(result).to.equal(3);
        });
        it('returns -1 if search fails', () => {
            const result = syntaxUtils.findNonEmptySymbol('a  ', 1);
            expect(result).to.equal(-1);
        });
    });
});
