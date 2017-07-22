const keywords = [
    "ACT",
    "ELSE",
    "ELSEIF",
    "END",
    "IF",
    "LET",
    "SET"
];

exports.toKeywordMap = () => {
    return keywords.reduce((obj, val) => {
        obj[val] = true;
        return obj;
    }, {});
};
