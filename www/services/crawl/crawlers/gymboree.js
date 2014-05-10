
/**
 * Crawler for Gymboree.
 * @author Tyler Beck
 * @version 1.0.0
 */

var utils = new require('./helpers/utilities'),

	factory = null;

var crawler = {

	/**
	 * @property products
	 * @type Array
	 */

	products: [],

	productURLs: [],

	getPagination: function() {

		var paginationLinks = this.evaluate(function() {

			var links = Array.prototype.slice.call(document.querySelector('.product-nav').querySelectorAll('a')),
				urls = [];

			links.splice((links.length - 1), 1);

			links.forEach(function(link, index) {

				urls.push(link.href);

			});

			return urls;

		});

		return paginationLinks || [];

	},

	getSales: function(me) {

		var products = this.evaluate(function() {

			var prods = document.querySelectorAll('.product-list-data > div'),
				currentProducts = [];

			for(var i = 0; i < prods.length; i++) {

				var current = prods.item(i);
				var link = current.querySelector('.collection-pricing a'),
				 	adjustedPrice = current.querySelector('.collection-pricing span.special-offer span'),
				 	categoryName = document.querySelector('.product-list-header h2').textContent;

				if(adjustedPrice != null) {

					var listPrice = current.querySelector('.collection-pricing s span');

					currentProducts.push(new Object({
						'href': link.href,
						'name': link.textContent,
						'category': categoryName,
						'adjustedPrice': adjustedPrice.textContent,
						'listPrice': listPrice.textContent
					}));

				}

			}

			return currentProducts;

		});

		me.products.push(products);

	},

	loopPagination: function(me, links, callback, index) {

		var self = this;

		if(index == null) index = 0;

		if(index > (links.length - 1)) {

			return callback();

		}

		self.open(links[index]).then(function() {

			factory.logger('Crawling URL: "' + links[index] + '" (Pagination)');

			me.getSales.apply(self, [me]);

			me.loopPagination.apply(self, [me, links, 
				callback, ++index]);

		});

	},

	loopDetails: function(me, index) {

		var self = this;

		if(index == null) index = 0;

		console.log(index, (me.products.length - 1));

		if(index > (me.products.length - 1)) {

			console.log("done...")

			return(factory.create(me.products));

		}

		var product = me.products[index];

		if(product && product.href) {

			if(!utils.contains(me.productURLs, product.href)) {

				factory.logger('Opening product details for ' + product.name + ' @ ' + product.href);

				this.open(product.href).then(function() {

					var additionalProduct = this.evaluate(function() {

						return(__utils.getAdditionals());

					});

					me.products[index] = utils.merge(additionalProduct, product);

					me.productURLs.push(product.href);

					me.loopDetails.apply(self, [me, ++index]);

				});

			} else {

				factory.logger('Skipped index: ' + index + ' - URL: ' + product.href);

				me.products.splice(index, 1);

				me.loopDetails.apply(self, [me, index]);

			}

		}

	},

	loop: function(me, categories, index) {

		var self = this;

		if(index == null) index = 2;
		
		if(index > 2/*(categories.length - 1)*/) {

			me.products = utils.flatten(me.products);

			factory.logger('Done crawling categories...\r\n');

			return(me.loopDetails.apply(self, [me]));

		}

		var URL = categories[index];

		this.open(URL).then(function() {

			factory.logger('Crawling URL: "' + URL + '" - ' + 
				index + ' of ' + (categories.length - 1));

			var links = me.getPagination.apply(self);

			me.getSales.apply(self, [me]);

			me.loopPagination.apply(this, [me, links, function() {

				me.loop.apply(self, [me, categories, ++index]);

			}]);

		});

	},

	run: function(me) {

		var categories = this.evaluate(function() {

			var categoriesAll = document.querySelectorAll('#mainDiv a');

				/**
				 * @property currentCategories

				 */

				currentCategories = [];

			for(var i = 0; i < categoriesAll.length; i++) {

				var currentItem = categoriesAll.item(i);

				currentCategories.push(currentItem.href);

			}

			return currentCategories;

		});

		me.loop.apply(this, [me, categories]);

	}

}

exports.spawn = function(myFactory) {

	factory = myFactory;

	return crawler.run.apply(this, [crawler]);

}