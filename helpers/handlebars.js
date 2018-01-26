var register = function(Handlebars) {
	var helpers = {
		ifZero: function(index, options) {
			if ( index%0 == 0 ) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		ifThird: function(index, options) {
			if (index > 0) {
				if ( index%3 == 0 ) {
					return options.fn(this);
				} else {
					return options.inverse(this);
				}
			}
		},
		ifFourth: function(index, options) {
			if (index > 0) {
				if ( index%4 == 0 ) {
					return options.fn(this);
				} else {
					return options.inverse(this);
				}
			}
		}
	};

	if (Handlebars && typeof Handlebars.registerHelper === "function") {
		for (var prop in helpers) {
			Handlebars.registerHelper(prop, helpers[prop]);
		}
	} else {
		return helpers;
	}

};

module.exports.register = register;
module.exports.helpers = register(null);