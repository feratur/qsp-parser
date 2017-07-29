const ERROR_MSG = require('../constants/ERROR_MSG');
const QspBlock = require('../classes/QspBlock');
const QspError = require('../classes/QspError');
const lineParser = require('./lineParser');

exports.parseCodeBlock = (name, codeList, lineNumbers) => {
    const commandList = [];
    const blockStack = [];
    const labelMap = {};
    for (let i = 0; i < codeList.length; ++i) {
        try {
            const parsedCommand = lineParser.parseLine(codeList[i], i, blockStack, labelMap);
            commandList.push(parsedCommand);
        } catch (err) {
            throw new QspError(err.message, name, lineNumbers[i], err);
        }
    }
    if (blockStack.length > 0)
        throw new QspError(ERROR_MSG.MISSING_END, name, -1, null);
    return new QspBlock(name, commandList, labelMap, lineNumbers);
};
