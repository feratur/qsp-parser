const functions = [
    { "name": "ARRCOMP", "minArgs": 1, "maxArgs": 1 },
    { "name": "ARRPOS", "minArgs": 1, "maxArgs": 3 },
    { "name": "ARRSIZE", "minArgs": 1, "maxArgs": 3 },
    { "name": "COUNTOBJ", "minArgs": 1, "maxArgs": 1 },
    { "name": "CURACTS", "minArgs": 0, "maxArgs": 0 },
    { "name": "CURLOC", "minArgs": 0, "maxArgs": 0 },
    { "name": "DESC", "minArgs": 0, "maxArgs": 0 },
    { "name": "DYNEVAL", "minArgs": 1, "maxArgs": 1 },
    { "name": "FUNC", "minArgs": 0, "maxArgs": 0 },
    { "name": "GETOBJ", "minArgs": 0, "maxArgs": 0 },
    { "name": "IIF", "minArgs": 0, "maxArgs": 0 },
    { "name": "INPUT", "minArgs": 0, "maxArgs": 0 },
    { "name": "INSTR", "minArgs": 0, "maxArgs": 0 },
    { "name": "ISNUM", "minArgs": 0, "maxArgs": 0 },
    { "name": "ISPLAY", "minArgs": 2, "maxArgs": 4 },
    { "name": "LCASE", "minArgs": 1, "maxArgs": 1 },
    { "name": "LEN", "minArgs": 1, "maxArgs": 1 },
    { "name": "MAINTXT", "minArgs": 0, "maxArgs": 0 },
    { "name": "MAX", "minArgs": 1, "maxArgs": 1 },
    { "name": "MID", "minArgs": 1, "maxArgs": 1 },
    { "name": "MIN", "minArgs": 1, "maxArgs": -1 },
    { "name": "MSECSCOUNT", "minArgs": 0, "maxArgs": 0 },
    { "name": "QSPVER", "minArgs": 0, "maxArgs": 0 },
    { "name": "RAND", "minArgs": 1, "maxArgs": -1 },
    { "name": "REPLACE", "minArgs": 1, "maxArgs": -1 },
    { "name": "RGB", "minArgs": 1, "maxArgs": -1 },
    { "name": "RND", "minArgs": 1, "maxArgs": -1 },
    { "name": "SELACT", "minArgs": 1, "maxArgs": 1 },
    { "name": "SELOBJ", "minArgs": 1, "maxArgs": 1 },
    { "name": "STATTXT", "minArgs": 0, "maxArgs": 0 },
    { "name": "STR", "minArgs": 1, "maxArgs": 1 },
    { "name": "STRCOMP", "minArgs": 0, "maxArgs": 0 },
    { "name": "STRFIND", "minArgs": 0, "maxArgs": 2 },
    { "name": "STRPOS", "minArgs": 1, "maxArgs": 1 },
    { "name": "TRIM", "minArgs": 1, "maxArgs": 1 },
    { "name": "UCASE", "minArgs": 0, "maxArgs": 1 },
    { "name": "USER_TEXT", "minArgs": 0, "maxArgs": 1 },
    { "name": "USRTXT", "minArgs": 0, "maxArgs": 1 },
    { "name": "VAL", "minArgs": 1, "maxArgs": 1 }
];

exports.toFunctionMap = () => {
    return functions.reduce((obj, val) => {
        obj[val.name] = val;
        return obj;
    }, {});
};
