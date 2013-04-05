define(function()
{
	return {
				
		'[data-event="click"]': {
			click: [
				function(e) {
					var el = this;
					require(['helpers/handler'], function(handler) { 
						handler(e, el); 
					});
				}
			],
		},
	}
});
