
/**
 * Crawler for Babies "R" Us.
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

	categoryAllSelector: '#categoryIndexBRU div',

	ppg: '&ppg=96',

	getSales: function(me) {

		var products = this.evaluate(function() {

			var prods = document.querySelectorAll('#familyProducts .prodloop_row_cont .prodloop_float'),
				currentProducts = [];

			for(var i = 0; i < prods.length; i++) {

				var current = prods.item(i);
				var link = current.querySelector('a.prodtitle'),
				 	adjustedPrice = current.querySelector('span.adjusted'),
				 	categoryName = document.querySelector('#BRUFamilyBrandTitle').textContent;

				if(adjustedPrice != null) {

					var listPrice = current.querySelector('span.listPrice2');

					currentProducts.push(new Object({
						'href': link.href,
						'name': link.textContent,
						'category': categoryName,
						'promotions': __utils.getPromotions(current),
						'eligibilities': __utils.getEligibilities(current),
						'adjustedPrice': adjustedPrice.textContent,
						'listPrice': listPrice.textContent
					}));

				}

			}

			return currentProducts;

		});

		me.products.push(products);

	},

	getPagination: function() {

		var paginationLinks = this.evaluate(function() {

			var links = Array.prototype.slice.call(document.querySelectorAll('#pagination a.pageNumber')),
				urls = [];

			links.forEach(function(link, index) {

				urls.push(link.href);

			});

			return urls;

		});

		return paginationLinks;

	},

	getFeatured: function() {

		var featuredLinks = this.evaluate(function() {

			var featuredCategories = document.querySelector('#featured-category'),

				links = [];

			if(featuredCategories != null) {

				var currentLinks = featuredCategories.querySelectorAll('div a.featured-category-link');
				
				for(var d = 0; d < currentLinks.length; d++) {
					
					var url = currentLinks.item(d).href;

					links.push(url);

				}

			}

			return links;

		});

		return featuredLinks;

	},

	loopPagination: function(me, links, callback, index) {

		var self = this;

		if(index == null) index = 0;

		if(index > (links.length - 1)) {

			return callback();

		}

		self.open(links[index]).then(function() {

			me.getSales.apply(self, [me]);

			me.loopPagination.apply(self, [me, links, 
				callback, ++index]);

		});

	},

	wrapSchema: function(products) {

		products.forEach(function(element, index) {

			products[index] = Object({

				'product': element

			});

		});

		return products;

	},

	loopDetails: function(me, index) {

		var self = this;

		if(index == null) index = 0;

		if(index > (me.products.length - 1)) {

			return(factory.create(me.wrapSchema(me.products)));

		}

		var product = me.products[index];

		if(product.href) {

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

		if(index == null) index = 17;
		
		if(index > 17/*(categories.length - 1)*/) {

			me.products = utils.flatten(me.products);

			factory.logger("Done crawling categories...\r\n");

			return(me.loopDetails.apply(self, [me]));

		}
		
		this.open(categories[index] + me.ppg).then(function() {

			factory.logger('Crawling Category: "' + this.evaluate(function() {

				return document.title;

			}) + '" - ' + index + ' of ' + (categories.length - 1));

			var featured = me.getFeatured.apply(this, [me]);

			if(featured.length) {

				categories.splice(index, 1);
				categories.splice(index, 0, featured);

				categories = utils.flatten(categories);

				me.loop.apply(self, [me, categories, index]);

			} else {

				var links = me.getPagination.apply(self);
				
				me.getSales.apply(self, [me]);

				me.loopPagination.apply(this, [me, links, function() {

					me.loop.apply(self, [me, categories, ++index]);

				}]);

			}

		});

	},

	run: function(me) {

		var categories = this.evaluate(function(me) {

			var categoriesAll = document.querySelectorAll(me.categoryAllSelector);

				/**
				 * @property currentCategories

				 */

				currentCategories = [];

			for(var i = 0; i < categoriesAll.length; i++) {

				var currentItem = categoriesAll.item(i);
				var currentList = currentItem.querySelectorAll('ul');

				if(currentList.length) {

					var items = currentList[0].querySelectorAll('li');
					
					for(var d = 0; d < items.length; d++) {
						
						var url = items.item(d).querySelector('a').href;

						currentCategories.push(url);

					}

				}

			}

			return currentCategories;

		}, me);

		me.loop.apply(this, [me, categories]);

	}

}

exports.spawn = function(myFactory) {

	factory = myFactory;

	return crawler.run.apply(this, [crawler]);

}