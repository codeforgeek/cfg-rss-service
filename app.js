const mongo = require('mongodb');
const nconf = require('nconf');
const chalk = require('chalk');
const cron = require('node-cron');
const EventEmitter = require('events');
const zmq = require("zeromq");
const sock = zmq.socket("sub");
const eventHandler = new EventEmitter();
// load config file
nconf.argv().env().file({ file: __dirname + '/config.json' });
const rss = require('./rss');

// connect to MongoDB
var dbo = null;
mongo.connect(nconf.get('mongodbURL'), {
    useNewUrlParser: true
}, (err, db) => {
    if (err) {
        console.log(chalk.red(err));
        process.exit(0);
    }
    dbo = db.db('codeforgeek');
    console.log(`${chalk.green('✓')} Connected to ${chalk.green('MongoDB')} database`);
    global.db = dbo;
    eventHandler.emit('ready');
});

eventHandler.on('ready', () => {
    // connect to queue
    sock.connect(nconf.get('socketSubConnection'));
    sock.subscribe(nconf.get('queue'));
    console.log(`${chalk.green('✓')} connected to message queue`);
});

// run rss generation every 24 hour at 12:00 AM
cron.schedule('0 0 0 * * *', () => {
    // start rss feed generation process
    rss.generateRss();
});

sock.on('message', (topic, message) => {
    if(topic.toString() === nconf.get('queue') && message.toString() === 'generateRssFeed') {
        // start sitemap generation process
        rss.generateRss();
    }
});