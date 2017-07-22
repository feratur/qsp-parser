const syntaxUtils = require('../utils/syntaxUtils');
const ERROR_MSG = require('../constants/ERROR_MSG');
const QspCommand = require('../classes/QspCommand');
const expressionFactory = require('../utils/expressionFactory');
const expressionParser = require('./expressionParser');
const variableParser = require('./variableParser');
const keywordManager = require('../utils/keywordManager');

const print = expr => {
    return new QspCommand('*PL', [expressionParser.parseExpression(expr)]);
};

const splitCmdArgs = argString => {
    if (argString.charAt(0) === '(') {
        const bracketIndex = syntaxUtils.findBracket(argString, 0);
        if (bracketIndex === argString.length - 1)
            return syntaxUtils.splitArguments(argString.slice(1, -1).trim());
    }
    return syntaxUtils.splitArguments(argString);
};

const getLetSetExpression = (head, line) => {
    const assignment =
        variableParser.parseSetVariable(line.slice(head.length).trim(), expressionParser.parseExpression);
    if (!assignment)
        throw new Error(ERROR_MSG.INVALID_KEYWORD(head));
    return assignment;
};

const getBlockStartExpression = (head, line, index, blockStack) => {
    if (line.charAt(line.length - 1) !== ':')
        throw new Error(ERROR_MSG.SYMBOL_MISSING(head, ':'));
    const args = splitCmdArgs(line.slice(head.length, -1).trim());
    let commandObj;
    if (head === 'IF') {
        syntaxUtils.validateArgCount(args, head, 1, 1);
        commandObj = new QspCommand('__IF__', args.map(x => expressionParser.parseExpression(x)));
        commandObj.args.push(expressionFactory.getIntExpression(index + 1));
    } else {
        syntaxUtils.validateArgCount(args, head, 1, 2);
        commandObj = new QspCommand('__ACT__', args.map(x => expressionParser.parseExpression(x)));
    }
    blockStack.push({cmdName: head, cmdObj: commandObj});
    return commandObj;
};

const getElseExpression = (head, line, index, blockStack) => {
    if (blockStack.length === 0)
        throw new Error(ERROR_MSG.INVALID_COMMAND_POSITION(head));
    switch (blockStack[blockStack.length - 1].cmdName) {
        case 'ELSEIF':
        case 'IF':
            break;
        default:
            throw new Error(ERROR_MSG.INVALID_COMMAND_POSITION(head));
    }
    let ifIndex;
    for (let i = blockStack.length - 1; i >= 0; --i) {
        if (blockStack[i].cmdName === 'IF') {
            ifIndex = i;
            break;
        }
    }
    if (head === 'ELSEIF') {
        if (line.charAt(line.length - 1) !== ':')
            throw new Error(ERROR_MSG.SYMBOL_MISSING(head, ':'));
        const args = splitCmdArgs(line.slice(head.length, -1).trim());
        syntaxUtils.validateArgCount(args, head, 1, 1);
        blockStack[ifIndex].cmdObj.args.push(expressionParser.parseExpression(args[0]));
    } else if (line !== 'ELSE') {
        throw new Error(ERROR_MSG.INVALID_KEYWORD(head));
    }
    blockStack[ifIndex].cmdObj.args.push(expressionFactory.getIntExpression(index + 1));
    const commandObj = new QspCommand('__JUMP_TO_LINE__', []);
    blockStack.push({cmdName: head, cmdObj: commandObj});
    return commandObj;
};

const getEndBlockExpression = (head, line, index, blockStack) => {
    if (blockStack.length === 0)
        throw new Error(ERROR_MSG.INVALID_COMMAND_POSITION(head));
    const endMatch = line.match(/^END(\s+IF)?$/);
    if (!endMatch)
        throw new Error(ERROR_MSG.INVALID_KEYWORD(head));
    const lastCmdName = blockStack[blockStack.length - 1].cmdName;
    if (lastCmdName === 'ACT') {
        if (endMatch[1])
            throw new Error(ERROR_MSG.INVALID_COMMAND_POSITION(head));
        const act = blockStack.pop();
        act.cmdObj.args.push(expressionFactory.getIntExpression(index));
    } else {
        while (true) {
            const entry = blockStack.pop();
            if (entry.cmdName === 'IF') {
                if (lastCmdName !== 'ELSE')
                    entry.cmdObj.args.push(expressionFactory.getIntExpression(index));
                break;
            } else {
                entry.cmdObj.args.push(expressionFactory.getIntExpression(index));
            }
        }
    }
    return null;
};

exports.parseLine = (line, index, blockStack, jumpLabels) => {
    if (line.charAt(0) === ':') {
        const label = line.slice(1).trim();
        if (!label)
            throw new Error(ERROR_MSG.INVALID_SYMBOL(':'));
        jumpLabels[label] = index;
        return null;
    }
    const wordMatch = line.match(/^\*?[^!&=<>+*/,'":(){}\-\[\]\s]+/);
    if (!wordMatch)
        return print(line);
    const head = wordMatch[0];
    switch (head) {
        case 'LET':
        case 'SET':
            return getLetSetExpression(head, line);
        case 'ACT':
        case 'IF':
            return getBlockStartExpression(head, line, index, blockStack);
        case 'ELSEIF':
        case 'ELSE':
            return getElseExpression(head, line, index, blockStack);
        case 'END':
            return getEndBlockExpression(head, line, index, blockStack);
    }
    const cmdObj = keywordManager.findCommand(head, line);
    if (cmdObj) {
        const {command} = cmdObj;
        const cmdTail = line.slice(cmdObj.match).trim();
        const args = splitCmdArgs(cmdTail);
        syntaxUtils.validateArgCount(args, command.name, command.minArgs, command.maxArgs);
        return new QspCommand(command.name, args.map(x => expressionParser.parseExpression(x)));
    }
    if (head.charAt(0) !== '*') {
        const assignment = variableParser.parseSetVariable(line, expressionParser.parseExpression);
        if (assignment)
            return assignment;
    }
    return print(line);
};
