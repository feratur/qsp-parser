module.exports = {
    BRACKET_NOT_FOUND: bracket => `Matching closing bracket for opening bracket '${bracket}' not found`,
    INVALID_SYMBOL: symbol => `Invalid usage of symbol '${symbol}'`,
    INVALID_KEYWORD: keyword => `Invalid usage of keyword '${keyword}'`,
    INVALID_COMMAND_POSITION: command => `Command '${command}' is placed in a wrong position`,
    ARG_SPLIT_ERROR: 'Failed to split procedure arguments',
    INVALID_ARG_COUNT: procName => `Invalid number of arguments for procedure '${procName}'`,
    SYMBOL_MISSING: (cmd, symbol) => `Symbol '${symbol}' is missing for '${cmd}' expression`,
    INVALID_OP_ORDER: 'Invalid order of operators/operands',
    INVALID_EXPR: 'Failed to parse expression',
    EMPTY_EXPR: 'Empty expression'
};
