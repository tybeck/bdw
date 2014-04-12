
/**
 * 
 * @author Tyler Beck
 * @version 1.0.0
 */

module.exports = exports = function() {

	this.evaluate(function() {

		window.__utils = {

			getPromotions: function(context) {

				var promotions = context.querySelectorAll('.promo.alert .alert'),

					promos = [];

				for(var i = 0; i < promotions.length; i++) {

					var currentPromotion = promotions.item(i);

					promos.push(currentPromotion.textContent);

				}

				return promos;

			},

			getEligibilities: function(context) {

				var eligibilities = context.querySelectorAll('ul#eligibility li'),

					list = [];

				for(var i = 0; i < eligibilities.length; i++) {

					var currentEligibility = eligibilities.item(i);

					list.push(currentEligibility.textContent);

				}

				return list;

			},

			getImagery: function() {

				var links = Array.prototype.slice.call(document.querySelectorAll('.altImages .imgButtons a')),

					imageList = [];

				if(links.length) {

					links.forEach(function(link, index) {

						var alternateImage = link.querySelector('img');
						var imagery = eval(link.href);

						if(alternateImage != null) {

							imagery.alternate = alternateImage.src;

						}

						imageList.push(imagery);

					});

				} else {

					var img = document.querySelector('#zoom-content .flyoutZoom img');
					var zoom = document.querySelector('#flyout-zoom img');

					imageList.push({
						'alternate': null,
						'img': (img != null ? img.src : null),
						'zoom': (zoom != null ? zoom.src : null)
					});

				}

				return imageList;

			},

			getAdditionals: function() {

				 var features = Array.prototype.slice.call(document.querySelectorAll('#Features ul li')),

				 	imagery = this.getImagery(),

				 	featuredList = [];

				 var brandType = document.querySelector('#lTitle ul li.first h3 label'),
			 		descriptionElement = document.querySelector('#Description p'),
				 	demoLink = document.querySelector('.viewDemo a');

				 features.forEach(function(item) {

				 	featuredList.push(item.textContent);

				 });

				 return({
				 	'brand': (brandType != null ? brandType.textContent: null),
				 	'desc': (descriptionElement != null ? descriptionElement.textContent: null),
				 	'demohref': (demoLink != null ? demoLink.href : null),
				 	'features': featuredList,
				 	'images': imagery
				 });

			}

		}

		window.swapImage = function(primary, zoom) {

			return({
				'img': primary,
				'zoom': zoom
			});

		}

	});

}