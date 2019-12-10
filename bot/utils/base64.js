module.exports = {
    decode: (string) => Buffer.from(string, "base64").toString("ascii"),
    encode: (string) => Buffer.from(string).toString("base64")
};