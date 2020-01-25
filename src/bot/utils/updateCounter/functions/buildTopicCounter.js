/**
 * 
 * @param {object} guildSettings 
 * @param {Number} count 
 */
const buildTopicCounter = (guildSettings, count) => {  
    const { topicCounterCustomNumbers } = guildSettings;
    return count
        .toString()
        .split("")
        .map(digit => digit = topicCounterCustomNumbers[digit])
        .join("");
}

module.exports = buildTopicCounter;