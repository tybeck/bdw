var server = null,

	childExec = require('child_process').exec,

	db = null;

var Jobs = {

	'command': 'casperjs.exe {{}}services/crawl/crawlfactory.js {{}} {{}} {{}}services/crawl/',

	'exec': function Exec(index, forced) {

		var self = this;

		db.searchJob(index, function(err, result) {

			if(!err) {

				if(forced) {
					
					if(!result) {
					
						return(server.kill('Index provided was not a valid crawling job!'));
					
					} else {

						var crawlingPath = self.command.uInject([
							server.web,
							result.job.url,
							result.job.type,
							server.web
						]);

						server.msg('Crawling index "' + index + '", this may take ' + 
							'awhile.  Go get a coffee!');

						childExec(crawlingPath, function(error, stdout, stderr) {
			
							if(!error && !stderr.length) {

								

							} else {

								// TODO: handle error

							}

						});

					}

				} else {


				}

			} else {

				// TODO: handle error

			}

		});

	},

	'init': function Init(serverApp, callback) {

		server = serverApp;

		db = server.getDB();

		callback();

	}

}

module.exports = exports = Jobs;
