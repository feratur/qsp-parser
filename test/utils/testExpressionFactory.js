const expressionFactory = require('../../src/utils/expressionFactory');
const EXPRESSION_TYPE = require('../../src/constants/EXPRESSION_TYPE');

const chai = require('chai');
const {describe, it} = require('mocha');
const dirtyChai = require('dirty-chai');
const {expect} = chai;

chai.use(dirtyChai);

describe('expressionFactory', () => {
    describe('getIntExpression', () => {
        it('works as intended', () => {
            const result = expressionFactory.getIntExpression(42);
            expect(result.type).to.equal(EXPRESSION_TYPE.INTEGER);
            expect(result.value).to.equal(42);
        });
    });
    describe('getRawStringExpression', () => {
        it('works as intended', () => {
            const result = expressionFactory.getRawStringExpression('Test');
            expect(result.type).to.equal(EXPRESSION_TYPE.STRING);
            expect(result.value).to.equal('Test');
        });
    });
    describe('getOperatorExpression', () => {
        it('works as intended', () => {
            const result = expressionFactory.getOperatorExpression('+');
            expect(result.type).to.equal(EXPRESSION_TYPE.OPERATOR);
            expect(result.value).to.equal('+');
        });
    });
    describe('getFunctionExpression', () => {
        it('works as intended', () => {
            const result = expressionFactory.getFunctionExpression('ARRCOMP', []);
            expect(result.type).to.equal(EXPRESSION_TYPE.FUNCTION);
            expect(result.value.name).to.equal('ARRCOMP');
            expect(result.value.args).to.be.empty();
        });
    });
    describe('getIndexedStringExpression', () => {
        it('works as intended', () => {
            const result = expressionFactory.getIndexedStringExpression('\'42\'');
            expect(result.type).to.equal(EXPRESSION_TYPE.FUNCTION);
            expect(result.value.name).to.equal('__GET_STR__');
            expect(result.value.args[0].type).to.equal(EXPRESSION_TYPE.INTEGER);
            expect(result.value.args[0].value).to.equal(42);
        });
    });
});
