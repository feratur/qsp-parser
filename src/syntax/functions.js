const functions = [
    { "name": "ARRCOMP", "minArgs": 2, "maxArgs": 3 },
    { "name": "ARRPOS", "minArgs": 2, "maxArgs": 3 },
    { "name": "ARRSIZE", "minArgs": 1, "maxArgs": 1 },
    { "name": "COUNTOBJ", "minArgs": 0, "maxArgs": 0 },
    { "name": "CURACTS", "minArgs": 0, "maxArgs": 0 },
    { "name": "CURLOC", "minArgs": 0, "maxArgs": 0 },
    { "name": "DESC", "minArgs": 1, "maxArgs": 1 },
    { "name": "DYNEVAL", "minArgs": 1, "maxArgs": -1 },
    { "name": "FUNC", "minArgs": 1, "maxArgs": -1 },
    { "name": "GETOBJ", "minArgs": 1, "maxArgs": 1 },
    { "name": "IIF", "minArgs": 3, "maxArgs": 3 },
    { "name": "INPUT", "minArgs": 1, "maxArgs": 1 },
    { "name": "INSTR", "minArgs": 2, "maxArgs": 3 },
    { "name": "ISNUM", "minArgs": 1, "maxArgs": 1 },
    { "name": "ISPLAY", "minArgs": 1, "maxArgs": 1 },
    { "name": "LCASE", "minArgs": 1, "maxArgs": 1 },
    { "name": "LEN", "minArgs": 1, "maxArgs": 1 },
    { "name": "MAINTXT", "minArgs": 0, "maxArgs": 0 },
    { "name": "MAX", "minArgs": 1, "maxArgs": -1 },
    { "name": "MID", "minArgs": 2, "maxArgs": 3 },
    { "name": "MIN", "minArgs": 1, "maxArgs": -1 },
    { "name": "MSECSCOUNT", "minArgs": 0, "maxArgs": 0 },
    { "name": "QSPVER", "minArgs": 0, "maxArgs": 0 },
    { "name": "RAND", "minArgs": 1, "maxArgs": 2 },
    { "name": "REPLACE", "minArgs": 2, "maxArgs": 3 },
    { "name": "RGB", "minArgs": 3, "maxArgs": 3 },
    { "name": "RND", "minArgs": 0, "maxArgs": 0 },
    { "name": "SELACT", "minArgs": 0, "maxArgs": 0 },
    { "name": "SELOBJ", "minArgs": 0, "maxArgs": 0 },
    { "name": "STATTXT", "minArgs": 0, "maxArgs": 0 },
    { "name": "STR", "minArgs": 1, "maxArgs": 1 },
    { "name": "STRCOMP", "minArgs": 2, "maxArgs": 2 },
    { "name": "STRFIND", "minArgs": 2, "maxArgs": 3 },
    { "name": "STRPOS", "minArgs": 2, "maxArgs": 3 },
    { "name": "TRIM", "minArgs": 1, "maxArgs": 1 },
    { "name": "UCASE", "minArgs": 1, "maxArgs": 1 },
    { "name": "USER_TEXT", "minArgs": 0, "maxArgs": 0 },
    { "name": "USRTXT", "minArgs": 0, "maxArgs": 0 },
    { "name": "VAL", "minArgs": 1, "maxArgs": 1 }
];

exports.toFunctionMap = () => {
    return functions.reduce((obj, val) => {
        obj[val.name] = val;
        return obj;
    }, {});
};
