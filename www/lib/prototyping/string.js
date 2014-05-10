module.exports = exports = function(serverApp) {

	serverApp.merge(String.prototype, {

		'uInject': function uInject(opts) {

			var i = -1;
			return this.replace(/\{\{(.*?)\}\}/g, function(match) {
				i++;
				return opts[i] ?
					opts[i] : 
					match;
			});

		}

	});

}