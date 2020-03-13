const site = require('./src/PublicManager');
const bot = require('./src/RadioBot');
const data = require('./src/DataManager');

async function start() {

    await data.init();
    site();
    bot();
}

start();