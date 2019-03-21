const fs = require('fs');
const path = require('path');
const save_logs = process.env.save_logs || require('../../bot-config.json').save_logs;
const botLog = (save_logs) ? fs.createWriteStream(path.join(__dirname,'..', '..', 'log', 'bot.log'), { 'flags': 'a'}) : undefined;
const errorLog = (save_logs) ? fs.createWriteStream(path.join(__dirname,'..', '..', 'log', 'error.log'), { 'flags': 'a'}) : undefined;

const timestamp = () => {
    let now = new Date();
    let year = now.getFullYear();
    let month = (now.getMonth()+1 < 10) ? "0" + (now.getMonth()+1) : now.getMonth()+1;
    let day = (now.getDate() < 10) ? "0" + now.getDate() : now.getDate();
    let hour = (now.getHours() < 10) ? "0" + now.getHours() : now.getHours();
    let minutes = (now.getMinutes() < 10) ? "0" + now.getMinutes() : now.getMinutes();
    let seconds = (now.getSeconds() < 10) ? "0" + now.getSeconds() : now.getSeconds();
    return `[${hour}:${minutes}:${seconds} ${day}-${month}-${year}]`;
}
const log = (data) => {
    console.log(timestamp() + " " + data);
    if (save_logs) botLog.write(timestamp() + " " + data + '\n');
}
const error = (data) => {
    console.error(`\x1b[37m\x1b[41m${timestamp()} ${data}\x1b[0m`);
    if (save_logs) errorLog.write(timestamp()  + " " + data + '\n');
}
module.exports = {
    log: log,
    error: error
}