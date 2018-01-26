// (function($){
	$(function(e){
		app.initialize();
	});
// })(jQuery);

var app = {
	initialize: function() {
		this.init_interactivities();
		this.init_autocomplete();
	},
	init_sidebar: function() {

	},
	init_forms: function() {
		
	},
	init_interactivities: function() {
		$('.tooltipped').tooltip({delay: 50});
		// Init Modals
		$('.modal').modal();
		$('select').material_select();
	},
	init_autocomplete: function() {
		// Initialize Automcomplete
	},
	init_autocomplete_datas: function(data, selector, pushFormat) {
		// Format Autocomplete
		var autocompleteData = [];
		$.each(data, function(index, val) {
			autocompleteData.push( { id: val._id, text:val.name + ' &mdash; ' + val.fullName } )
		});
		if (selector == undefined) {
			selector = 'input.autocomplete';
		}
		$(selector).autocomplete2({
			data: autocompleteData
		});
	}
}