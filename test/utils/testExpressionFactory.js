const expressionFactory = require('../../src/utils/expressionFactory');

const chai = require('chai');
const {describe, it} = require('mocha');
const dirtyChai = require('dirty-chai');
const {expect} = chai;

chai.use(dirtyChai);

describe('expressionFactory', () => {
    describe('getIntExpression', () => {
        it('works as intended', () => {
            const result = expressionFactory.getIntExpression(42);
            expect(result.isAtom).to.be.true();
            expect(result.value).to.equal(42);
        });
    });
    describe('getOperatorExpression', () => {
        it('works as intended', () => {
            const result = expressionFactory.getOperatorExpression('+');
            expect(result.isAtom).to.be.true();
            expect(result.value).to.equal('+');
        });
    });
    describe('getFunctionExpression', () => {
        it('works as intended', () => {
            const result = expressionFactory.getFunctionExpression('ARRCOMP', []);
            expect(result.isAtom).to.be.false();
            expect(result.value.name).to.equal('ARRCOMP');
            expect(result.value.args).to.be.empty();
        });
    });
    describe('getIndexedStringExpression', () => {
        it('works as intended', () => {
            const result = expressionFactory.getIndexedStringExpression('\'42\'');
            expect(result.isAtom).to.be.false();
            expect(result.value.name).to.equal('__GET_STR__');
            expect(result.value.args[0].isAtom).to.be.true();
            expect(result.value.args[0].value).to.equal(42);
        });
    });
});
