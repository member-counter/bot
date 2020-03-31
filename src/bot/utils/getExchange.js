const fetch = require("node-fetch");

let exchangeCache = null;

setInterval(() => {
    exchangeCache = null;
}, 24 * 60 * 60 * 1000);

module.exports = () => {
    return new Promise((resolve, reject) => {
        if (!exchangeCache) {
            fetch(`https://api.exchangeratesapi.io/latest`)
                .then(res => res.json())
                .then(exchange => {
                    exchangeCache = exchange;
                    resolve(exchange);
                })
                .catch(reject);
        } else {
            resolve(exchangeCache);
        }
    });
};
