'use strict'
const mongoose = require('mongoose');
const _SECONDS = 5000
const countConnect = () => {
    const count = mongoose.connections.length
    console.log(`Number of connections:: ${count}`);
}
// check over loaded connections
const overLoadedConnections = () => {
    setInterval(() => {
        const count = mongoose.connections.length
        const numCores = require('os').cpus().length
        const memoryUsage = require('process').memoryUsage().rss
        const maxConnections = numCores * 4
        console.log(`Active connections:: `,count);
        console.log('Memory usage::', memoryUsage / 1024 / 1024, 'MB');
        if (count > maxConnections) {
            console.log(`connections:: ${count}, maxConnections:: ${maxConnections}`);
        }
    }, _SECONDS)


}
module.exports = {
    countConnect,
    overLoadedConnections
}