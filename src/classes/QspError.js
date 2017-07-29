class QspError extends Error {
    constructor(message, blockName, lineNumber, innerError) {
        super(message);
        this.name = 'QspError';
        this.blockName = blockName;
        this.lineNumber = lineNumber;
        this.innerError = innerError;
    }
}

module.exports = QspError;
