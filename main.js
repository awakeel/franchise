(function() {
	'use strict';
	require.config({
		deps : [ 'main' ],
		waitSeconds : 400,
		urlArgs : "v=4"  + new Date().getTime(),
		paths : {
			jquery : 'libs/jquery',
			underscore : 'libs/underscore',
			backbone : 'libs/backbone-min',
			text : 'libs/text',
			router:'router',
			'moment' : 'libs/moment',
			'bootstrap' : 'libs/bootstrap.min',
			'flex' : 'js/flex',
			'wizard' : 'libs/wizard',
			'fullcalendar' : 'libs/fullcalendar.min',
			'datepicker':"libs/bootstrap-datepicker",
			'timepick':'libs/timepick',
			'daterangepicker':"libs/daterangepicker",
			'typeahead':'libs/typeahead.min',
			'tokenfield':"libs/bootstrap-tokenfield.min", 
			'spin':'libs/spin',
			'swal':'libs/sweetalert',
			'qtip':'libs/qtip',
			'jqueryui':'libs/jquery-ui.min'
			
		},
		shim : {
			jquery : {
				exports : 'jQuery'
			},
			backbone : {
				deps : [ 'jquery', 'underscore' ],
				exports : 'Backbone'
			},
			underscore : {
				exports : '_'
			},
			flex : {
				deps : [ 'jquery' ],
				exports : 'flex'
			},
			wizard : {
				deps : [ 'jquery' ],
				exports : 'wizard'
			},
			fullcalendar : {
				deps : [ 'jquery' ],
				exports : 'fullcalendar'
			},
		
			bootstrap : [ 'jquery' ],
			swal  : {
				deps : [ 'jquery','bootstrap' ],
				exports : 'swal'
			},
		}
	});

	require([ 'jquery', 'bootstrap', 'backbone','router'], function($,bootstrap,Backbone,router  ) {
		 
		var mainRouter = new router();
			Backbone.history.start({
				pushState : true
			}); //Start routing
			/// what is going wrong with this
		})

})();
