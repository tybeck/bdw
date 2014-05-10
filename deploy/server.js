/**
 * Baby Deals Watcher - Application Server
 * @author Tyler Beck
 * @version 0.0.7
 */

 'use strict';

 var 

 	/**
 	 * Primary Express Application-Hook
 	 * @property express
 	 */

 	express = require('express'), 

	/**
	 * Helper for creating meta data for available argument options.
	 * @property program
	 * @type Class
	 */

 	program = require('commander'),

 	/**
 	 * Primary Application Server
 	 * @property Server
 	 */

 	Server = null;

Server = {

	APP_VERSION: '0.0.7',

	/**
	 * Current directory of our server application.
	 * @property dir
	 * @type String
	 */

	dir: __dirname + '/',

	/**
	 * Current directory of our web files.
	 * @property web
	 * @type String
	 */

	web: __dirname + '/../www/',

	'modules': ['router', 'db', 'jobs' /* 'mail' */],

	'prototyping': ['string'],

	/**
	 * Basis of our express application.
	 * @property app
	 * @type Object
	 */

	'app': null, 

	/**
	 * Declaration for our router object
	 * @property router
	 * @type Class
	 */

	'router': null,

	/**
	 * Declaration for our database object
	 * @property db
	 * @type Class
	 */

	'db': null,

	/**
	 * Declaration for our jobs object
	 * @property jobs
	 * @type Class
	 */

	'jobs': null,

	/**
	 * Get's our Application Object
	 * @method getApp
	 */

	'getApp': function getApp() {

		return this.app;

	},

	/**
	 * Get's our Router Object
	 * @method getRouter
	 */

	'getRouter': function getRouter() {

		return this.router;

	},

	/**
	 * Get's our Database Object
	 * @method getDB
	 */

	'getDB': function getDB() {

		return this.db;

	},

	/**
	 * Get's our Jobs Object
	 * @method getJobs
	 */

	'getJobs': function getJobs() {

		return this.jobs;

	},

	'commands': {

		/**
		 * Crawl's an specified index, collect's the data, then stores it in the database.
		 * @param {String} index Provided crawling index (babiesrus, gymboree, etc.)
		 * @method crawl
		 */

		'crawl': function Crawl(index) {

			var self = this;

			if(!index.length) {

				return(
					self.msg(true)
						.msg('BabyDealsWatcher - v' + self.APP_VERSION)
						.msg('Index not provided!')
				);

			}

			self.msg('Initializing modules...');

			self.createModules(function() {

				self.getJobs()
					.exec(index, true);

			});

		},

		/**
		 * Begin's the process of starting our application server.
		 * @param {String} environment What stage of deployment should we launch
		 * @method run
		 */

		'run': function Run(environment) {

			var self = this;

			if(typeof environment != 'string') {

				environment = 'development';

			}

			self.msg('Initializing modules...');

			self.createModules(function() {

				self.start();

			});

		}

	},

	/**
	 * Proxies an object into the 'this' object of an listener.
	 * @method proxy
	 * @type Function
	 */

	'proxy': function Proxy(obj, route) {

		return(function() {

			return route.apply(obj, arguments);

		});

	},

	/**
	 * Merges two object's into one.
	 * @method merge
	 * @type Function
	 */

	'merge': function Merge(obj1, obj2) {

		for (var p in obj2) {
			
			try {

				if (obj2[p].constructor == Object) {

					obj1[p] = this.merge(obj1[p], obj2[p]);

				} else {

					obj1[p] = obj2[p];

				}

			} catch(e) {

				obj1[p] = obj2[p];

			}
		
		}

		return obj1;

	},

	/**
	 * Default messaging logger
	 * @param {String} message Message to log
	 * @method msg
	 */

	'msg': function Msg(message) {

		(typeof message == 'boolean' && message) ?
			
			console.log('\r\n') :

			console.log('\x1B[1m\x1B[33m## bdw ##\x1B[39m\x1B[22m ' + message);

		return this;

	},

	/**
	 * Send an message; then kill our application server.
	 * @param {String} message Message to log
	 * @method kill
	 */

	'kill': function Kill(message) {

		this.msg(message);

		process.exit(0);

	},

	/**
	 * Create's our modules which extend logic to our appliction server.
	 * @method createModules
	*/

	'createModules': function createModules(cb) {

		var moduleNo = -1,

			self = this;

		(function nextModule() {

			if(++moduleNo < self.modules.length) {

				var module = self.modules[moduleNo];

				self[module] = require(self.web + 'services/' + module);

				if(self[module].init) {

					self[module].init(self, nextModule);

				}

			} else {

				if(typeof cb == 'function') cb();

			}

		})();

	},

	/**
	 * Extend native objects by prototypes.
	 * @method extendByPrototyping
	*/

	'extendByPrototyping': function extendByPrototyping() {

		var self = this;

		self.prototyping.forEach(function(prototype) {

			require(self.web + 'lib/prototyping/' + prototype)(self);

		});

	},

	/**
	 * Start our application server
	 * @method setup
	*/

	'start': function Start() {

		this.msg(true)
			.msg('v' + this.APP_VERSION)
			.msg('BabyDealsWatcher - Application Server is running!\r\n');

		this.db.sendProducts();

	},

	/**
	 * Initialization
	 * @method init
	 */

	'init': function Init() {

		program.version(this.APP_VERSION);

		program
			.command('crawl')
			.description('Begin\'s crawling specific index if the ' +
				'application server is not already running an crawling process.')
			.action(this.proxy(this, this.commands.crawl));

		program
			.command('run')
			.description('Run our application server (environment default: development).')
			.action(this.proxy(this, this.commands.run));

		this.extendByPrototyping();

		program.parse(process.argv);

	}

}

module.exports.Server = Server;

Server.init();