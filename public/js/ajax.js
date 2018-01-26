var url = window.location.href
	arrURL = url.split("/");

var ajax = {
	initialize: function() {
		api.initialize();
	},
	// Getting api datas
	getAPIdatas: function() {
		// Load for Types
	},
}

var api = {
	initialize: function() {

	},
	fetch: function() {
		var reqURL = $('.ajax-url').attr('data-ajax');
	},
	restFul: function() {

	}
}

var types = {
	save: function(action, resultDiv, preloaderDiv, append) {
		if (action === 'new') {
			var frmParent = '#form-add-type',
				$NAME = $(frmParent + ' #name'),
				$DESC = $(frmParent + ' #description');
			$.ajax({
				url: '/api/documents/types/save/',
				method: 'post',
				dataType: 'json',
				data: {
					name: $NAME.val(),
					description: $DESC.val()
				},
				beforeSend: function(xhr, plainOBJ) {
					$(preloaderDiv).html('<div class="progress"> <div class="indeterminate"></div> </div>');
				},
				success(result,status,xhr) {
					if ( result ) {
						var HTML = '<div class="col s12 m3">';
							HTML += '<a href="/documents/types/'+ result._id +'">';
							HTML += '<div class="card blue-grey darken-1">';
							HTML += '<div class="card-content white-text">';
							HTML += '<span class="card-title">'+ result.name +'</span>';
							HTML += '<p>'+ result.description +'</p>';
							HTML += '</div>';
							HTML += '<div class="card-action">';
							HTML += '<a href="#">This is a link</a>';
							HTML += '<a href="#">This is a link</a>';
							HTML += '</div>';
							HTML += '</div>';
							HTML += '</a>';
							HTML += '</div>';
						if ( typeof append == 'undefined' ) {
							$(resultDiv).prepend(HTML);
						} else {
							if (append == true) {
								$(resultDiv).append(HTML);
							}
						}
					}
				},
				complete(xhr, status) {
					if (status == 'success') {
						$(preloaderDiv).html('');
						$NAME.val('');
						$DESC.val('');
						$DESC.trigger('autoresize');
						return false;
					};
				},
				error: function(xhr, status, err) {
					$(preloaderDiv).html('');
					console.log(err);
				} 
			});
		} else if (action === 'edit') {

		}
	}
}

// Document Type Fields
var docTypeFields = {
	save: function(action, resultDiv, preloaderDiv, append) {
		if (action === 'new') {
			var frmParent = '#form-add-field',
				$NAME = $(frmParent + ' #name'),
				$DESC = $(frmParent + ' #description'),
				$INPUT = $(frmParent + ' #inputType'),
				$DEFAULT = $(frmParent + ' #defaults'),
				$VALTABLE = $(frmParent + ' #valueTable');
			$.ajax({
				url: '/api/documents/types/field/save',
				method: 'post',
				dataType: 'json',
				data: {
					name: $NAME.val(),
					description: $DESC.val(),
					inputType: $INPUT.val(),
					defaults: $DEFAULT.val(),
					valueTable: $VALTABLE.val()
				},
				beforeSend: function(xhr, plainOBJ) {
					$(preloaderDiv).html('<div class="progress"> <div class="indeterminate"></div> </div>');
				},
				success(result,status,xhr) {
					if ( result ) {
						var HTML = '<li class="collection-item avatar">';
							HTML += '<i class="circle green fa fa-list-alt" aria-hidden="true"></i>';
							HTML += '<span class="title">'+ result.name +'</span>';
							HTML += '<p>First Line <br>';
							HTML += 'Second Line';
							HTML += '</p>';
							HTML += '</li>';
						if ( typeof append == 'undefined' ) {
							$(resultDiv).prepend(HTML);
						} else {
							if (append == true) {
								$(resultDiv).append(HTML);
							}
						}
					}
				},
				complete(xhr, status) {
					if (status == 'success') {
						$(preloaderDiv).html('');
						$NAME.val('');
						$DESC.val('');
						$DESC.trigger('autoresize');
						$INPUT.val('txtBox');
						$DEFAULT.val('0');
						$VALTABLE.val('valueTable');
						return false;
					};
				},
				error: function(xhr, status, err) {
					$(preloaderDiv).html('');
					console.log(xhr.responseText);
					console.log(err.Message);
				} 
			});	
		}
	}
}