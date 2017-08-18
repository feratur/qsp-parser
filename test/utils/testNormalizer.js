const normalizer = require('../../src/utils/normalizer');

const chai = require('chai');
const {describe, it} = require('mocha');
const dirtyChai = require('dirty-chai');
const {expect} = chai;

chai.use(dirtyChai);

describe('normalizer', () => {
    describe('splitRawQspString', () => {
        it('works as intended', () => {
            const result = normalizer.splitRawQspString('foo\r\nbar');
            expect(result).to.deep.equal(['foo', 'bar']);
        });
    });
    describe('getStringsAndComments', () => {
        it('works as intended', () => {
            const fixture = [
                ' !"commented',
                'line" 123',
                'string "here',
                'and here" plus & ! another comment',
                'just a simple line'
            ];
            const expectedResult = {
                "stringMap": {
                    "2": [
                        {
                            "startLineIndex": 2,
                            "startCharIndex": 7,
                            "endLineIndex": 3,
                            "endCharIndex": 8
                        }
                    ]
                },
                "commentMap": {
                    "0": 0,
                    "1": 0,
                    "3": 16
                }
            };
            const result = normalizer.getStringsAndComments('TEST', fixture);
            expect(result).to.deep.equal(expectedResult);
        });
        it('throws on invalid string/comment', () => {
            const test1 = () => normalizer.getStringsAndComments('TEST', [`!'12`]);
            const test2 = () => normalizer.getStringsAndComments('TEST', [`"123`]);
            expect(test1).to.throw();
            expect(test2).to.throw();
        });
    });
});
