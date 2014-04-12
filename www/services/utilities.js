
/**
 * 
 * @author Tyler Beck
 * @version 1.0.0
 */

module.exports = exports = {

	flatten: function(_2d) {

		var merged = [];

		return(merged.concat.apply(merged, _2d));

	},

	merge: function(obj1, obj2) {

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

	contains: function(arr, needle) {

		var found = false;

		arr.forEach(function(item, index) {

			if(item == needle) found = true;

		});

		return found;

	}

}