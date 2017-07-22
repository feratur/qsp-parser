const commands = [
    { "name": "ADDLIB", "minArgs": 1, "maxArgs": 1 },
    { "name": "ADD OBJ", "minArgs": 1, "maxArgs": 3 },
    { "name": "ADDOBJ", "minArgs": 1, "maxArgs": 3 },
    { "name": "ADDQST", "minArgs": 1, "maxArgs": 1 },
    { "name": "CLA", "minArgs": 0, "maxArgs": 0 },
    { "name": "CLEAR", "minArgs": 0, "maxArgs": 0 },
    { "name": "*CLEAR", "minArgs": 0, "maxArgs": 0 },
    { "name": "CLOSE", "minArgs": 1, "maxArgs": 1 },
    { "name": "CLOSE ALL", "minArgs": 0, "maxArgs": 0 },
    { "name": "CLR", "minArgs": 0, "maxArgs": 0 },
    { "name": "*CLR", "minArgs": 0, "maxArgs": 0 },
    { "name": "CLS", "minArgs": 0, "maxArgs": 0 },
    { "name": "CMDCLEAR", "minArgs": 0, "maxArgs": 0 },
    { "name": "CMDCLR", "minArgs": 0, "maxArgs": 0 },
    { "name": "COPYARR", "minArgs": 2, "maxArgs": 4 },
    { "name": "DEL ACT", "minArgs": 1, "maxArgs": 1 },
    { "name": "DELACT", "minArgs": 1, "maxArgs": 1 },
    { "name": "DELLIB", "minArgs": 0, "maxArgs": 0 },
    { "name": "DEL OBJ", "minArgs": 1, "maxArgs": 1 },
    { "name": "DELOBJ", "minArgs": 1, "maxArgs": 1 },
    { "name": "DYNAMIC", "minArgs": 1, "maxArgs": -1 },
    { "name": "EXIT", "minArgs": 0, "maxArgs": 0 },
    { "name": "FREELIB", "minArgs": 0, "maxArgs": 0 },
    { "name": "GOSUB", "minArgs": 1, "maxArgs": -1 },
    { "name": "GOTO", "minArgs": 1, "maxArgs": -1 },
    { "name": "GS", "minArgs": 1, "maxArgs": -1 },
    { "name": "GT", "minArgs": 1, "maxArgs": -1 },
    { "name": "INCLIB", "minArgs": 1, "maxArgs": 1 },
    { "name": "JUMP", "minArgs": 1, "maxArgs": 1 },
    { "name": "KILLALL", "minArgs": 0, "maxArgs": 0 },
    { "name": "KILLOBJ", "minArgs": 0, "maxArgs": 1 },
    { "name": "KILLQST", "minArgs": 0, "maxArgs": 0 },
    { "name": "KILLVAR", "minArgs": 0, "maxArgs": 2 },
    { "name": "MENU", "minArgs": 1, "maxArgs": 1 },
    { "name": "MSG", "minArgs": 1, "maxArgs": 1 },
    { "name": "NL", "minArgs": 0, "maxArgs": 1 },
    { "name": "*NL", "minArgs": 0, "maxArgs": 1 },
    { "name": "OPENGAME", "minArgs": 0, "maxArgs": 1 },
    { "name": "OPENQST", "minArgs": 1, "maxArgs": 1 },
    { "name": "P", "minArgs": 1, "maxArgs": 1 },
    { "name": "*P", "minArgs": 1, "maxArgs": 1 },
    { "name": "PL", "minArgs": 0, "maxArgs": 1 },
    { "name": "*PL", "minArgs": 0, "maxArgs": 1 },
    { "name": "PLAY", "minArgs": 1, "maxArgs": 2 },
    { "name": "REFINT", "minArgs": 0, "maxArgs": 0 },
    { "name": "SAVEGAME", "minArgs": 0, "maxArgs": 1 },
    { "name": "SETTIMER", "minArgs": 1, "maxArgs": 1 },
    { "name": "SHOWACTS", "minArgs": 1, "maxArgs": 1 },
    { "name": "SHOWINPUT", "minArgs": 1, "maxArgs": 1 },
    { "name": "SHOWOBJS", "minArgs": 1, "maxArgs": 1 },
    { "name": "SHOWSTAT", "minArgs": 1, "maxArgs": 1 },
    { "name": "UNSEL", "minArgs": 0, "maxArgs": 0 },
    { "name": "UNSELECT", "minArgs": 0, "maxArgs": 0 },
    { "name": "VIEW", "minArgs": 0, "maxArgs": 1 },
    { "name": "WAIT", "minArgs": 1, "maxArgs": 1 },
    { "name": "XGOTO", "minArgs": 1, "maxArgs": -1 },
    { "name": "XGT", "minArgs": 1, "maxArgs": -1 }
];

exports.toCommandMap = () => {
    const result = {};
    for (const command of commands) {
        const words = command.name.split(' ');
        const catchWord = words[0];
        let regex = null;
        if (words.length > 1) {
            const wordLiterals = words.map(x => x.replace(/\W/g, '\\$&'));
            regex = new RegExp(`^${wordLiterals.join('\\s+')}(?=$|[!&=<>+*/,'":(){}\\-\\[\\]\\s])`);
        }
        const entry = {
            wordCount: words.length,
            regex: regex,
            command: command
        };
        const mapValue = result[catchWord];
        if (mapValue) {
            mapValue.push(entry);
            mapValue.sort((x, y) => y.wordCount - x.wordCount);
        } else {
            result[catchWord] = [entry];
        }
    }
    return result;
};
