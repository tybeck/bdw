
/**
 * Crawl Factory allow's us to run automatic scrapings of
 * websites to gather deals, sales, and other information.
 * @author Tyler Beck
 * @version 1.0.0
 */

var fs = require('fs'),

	casper = require('casper').create({
		
		'pageSettings': {
        	
        	'webSecurityEnabled': false

    	}

	});

var factory = {

	filepath: 'crawled.json',

	/**
	 * Logger to terminal
	 * @method logger
	 * @type Function
	 */

	logger: function(msg) {

		console.log(msg);

	},

	/**
	 * Kill our PhantomJS process.
	 * @method kill
	 * @type Function
	 */

	kill: function() {

		phantom.exit(0);

	},

	/**
	 * Removes our crawling JSON file.
	 * @method removeFile
	 * @type Function
	 */

	removeFile: function(filepath) {

		if(fs.isFile(filepath)) {

			fs.remove(filepath);

			return(this.removeFile(filepath));

		}

		return true;

	},

	wrap: function(data) {

		return({
			'crawled': data
		});

	},

	/**
	 * Create an empty JSON file incase of issues with data, server, etc...
	 * @method createEmpty
	 * @type Function
	 */

	create: function(data) {

		if(this.removeFile(this.filepath)) {

			var stream = fs.open(this.filepath, 'w+');

			stream.write(JSON.stringify(((data != null) ? 
				this.wrap(data) : 
				new Object())));

			stream.close();

		}

		return this;

	},

	/**
	 * Crawl our website using our specified method.
	 * @method crawl
	 * @type Function
	 */

	crawl: function() {

		var crawler = new require('./crawlers/' + casper.cli.args[1]);

		crawler.spawn.apply(casper, [this]);

	},

	/**
	 * Run our crawling processes.
	 * @method run
	 * @type Function
	 */

	run: function() {

		var self = this;

		casper.on('load.finished', new require('./events/' + casper.cli.args[1] + '/loadfinished'));

		casper.start(casper.cli.args[0])
			.then(function() {
				self.crawl.apply(self);
			})
			.run();

	}

}

factory.run();