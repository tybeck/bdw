var mongoose = require('mongoose'),

	db = null,

	callback = null,

	server = null;

var Connection = {

	'events': {

		'connectionError': function connectionError() {

			server.kill('Could not establish database connection!');

		},

		'connectionOpen': function connectionOpen() {

			server.msg('Database connection established!');

			callback();

		}

	},

	'sendProducts': function sendProducts() {

		// this.Product.create();

	},

	'searchJob': function searchJob(index, fn) {

		this.Job.findOne({ 'job.type': index }, function(err, result) {

			if(typeof fn === 'function') {

				return(fn(err, result));

			}

		});

	},

	/**
	 * Setup our DB schema structures.
	 * @method setupSchemas
	 */

	'setupSchemas': function setupSchemas() {

		this.ProductSchema = new mongoose.Schema({ 'product': {} });

		this.Product = mongoose.model('products', this.ProductSchema);

		this.JobSchema = new mongoose.Schema({ 'job': {} });

		this.Job = mongoose.model('jobs', this.JobSchema);

	},

	/**
	 * Create a connection to our database.
	 * @method createConnection
	 */

	'createConnection': function createConnection() {

		mongoose.connect('mongodb://localhost/bdw');

		db = mongoose.connection;

	},

	/**
	 * Register events to our database (errors, open)
	 * @method registerEvents
	 */

	'registerEvents': function registerEvents() {

		db.on('error', this.connectionError);

		db.once('open', this.connectionOpen);

	},

	'init': function Init(serverApp, callbackApp) {

		server = serverApp;

		callback = callbackApp;

		this.setupSchemas();

		this.createConnection();

		this.registerEvents.apply(this.events);

	}

}

module.exports = exports = Connection;
