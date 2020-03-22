/**
 * 
 * @param {Object} Digits 
 * @param {Number} count 
 */
const replaceWithCustomDigits = (customDigits, count) => {
    return count
        .toString()
        .split("")
        .map(digit => digit = customDigits[digit])
        .join("");
}

module.exports = replaceWithCustomDigits;