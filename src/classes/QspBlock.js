class QspBlock {
    constructor(name, commandList, labelMap, lineNumbers) {
        this.name = name;
        this.commandList = commandList;
        this.labelMap = labelMap;
        this.lineNumbers = lineNumbers;
    }
}

module.exports = QspBlock;
