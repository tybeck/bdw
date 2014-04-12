
/**
 * 
 * @author Tyler Beck
 * @version 1.0.0
 */

module.exports = exports = function() {

	this.evaluate(function() {
		
		window.__utils = {

			getImagery: function() {

				var img = document.querySelector('#p-picture'), 

					imageList = [];
					
				imageList.push({
					'alternate': null,
					'img': (img != null ? img.src : null),
					'zoom': null
				});

				return imageList;

			},

			getAdditionals: function() {

				var features = Array.prototype.slice.call(document.querySelectorAll('#p-options li')),

					imagery = this.getImagery(),

					featuredList = [];

				var descriptionElement = document.querySelector('#p-desc');

				features.forEach(function(item) {

					featuredList.push(item.textContent);

				});

				return({
					'brand': 'Gymboree',
					'desc': (descriptionElement != null ? descriptionElement.textContent: null),
					'features': featuredList,
					'images': imagery
				});

			}

		}

	});

}