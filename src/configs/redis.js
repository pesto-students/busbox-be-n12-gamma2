const redis = require('redis')

const REDIS_PORT = process.env.REDIS_PORT || 6379
let client = undefined;

const getClient = async () => {
    if(!client) {
        client = redis.createClient(REDIS_PORT);
        await client.connect()
    }
    return client
}

module.exports = {getClient}