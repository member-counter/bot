const fetch = require("node-fetch");

const exchangeDiscardCacheTime = 12 * 60 * 60 * 1000; //12 hours
let nextExchangeFetch = new Date();
    nextExchangeFetch.setMilliseconds(exchangeDiscardCacheTime);
let exchangeCache = null;

module.exports = () => {
    return new Promise((resolve, reject) => {
        if (!exchangeCache || (new Date()).getTime() > nextExchangeFetch.getTime()) {
            fetch(`https://api.exchangeratesapi.io/latest`)
                .then(res => res.json())
                .then(exchange => {
                    nextExchangeFetch = new Date();
                    nextExchangeFetch.setMilliseconds(exchangeDiscardCacheTime);
                    exchangeCache = exchange;
                    resolve(exchange);
                })
                .catch(reject);
        } else {
            resolve(exchangeCache);
        }
    });
};
