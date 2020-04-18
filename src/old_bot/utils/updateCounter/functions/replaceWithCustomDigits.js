/**
 * 
 * @param {Object} Digits 
 * @param {Number} count 
 */
const replaceWithCustomDigits = (customDigits, count) => {
    if (typeof count === "string") return count;
    return count
        .toString()
        .split("")
        .map(digit => digit = customDigits[digit])
        .join("");
}

module.exports = replaceWithCustomDigits;