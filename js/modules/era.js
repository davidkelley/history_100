define(['jquery'], function($) {

	$(window).ready(function() {
		$('#early-history h2').click();
	});

	return {
		toggle: function(el, e) {

			var era = $(el).closest('.era');

			//first close all other open periods
			$('.era').each(function() {
				if (this !== era[0]) {
					$('.periods', this).slideUp();
					$(this).removeClass('open').addClass('closed');
				}
			});

			era.toggleClass('open closed');
			$('.periods', era).slideToggle(500);
		}
	}

});