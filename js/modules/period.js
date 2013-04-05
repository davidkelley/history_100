define(['jquery', 'module'], function($, module) {

	var config = module.config();
	var container = $(config.popupContainer);
	var backgrounds = $(config.backgroundContainer);
	var positions = config.positions;

	var era, period, doc, xml = $.ajax({
		url: 'data.xml',
		dataType: 'xml',
		success: function(data) {
			doc = $(data);
		}
	});

	return {

		hide: function() {
			container.animate({opacity:0}, 250, function() {
				$('html').removeClass('popup-visible');
				backgrounds.animate({opacity:0}, 250, function() {
					container.empty();
					backgrounds.empty();
					container.css({opacity:1});
					backgrounds.css({opacity:1});
				});
			});
			
		},

		queue: function(fnc) {
			var that = this;
			xml.done(function(context, status, ajax) {
				if (status == "success" && doc) {
					fnc.call(that, doc);
				}
			})
		},

		find: function(title, cb) {

			this.queue(function(doc) {

				var periods = doc.find('era[name="' + era + '"] period');
				
				periods.each(function(i) {
					if ($('title', this).text() == title) {

						if (typeof cb == "function") {
							cb($(this));
						}

						return false;
					}
				});

			});
		},

		checkOrder: function(el) {
			if (period.prev().length == 0) {
				$(el).addClass('no-prev');
			}

			if (period.next().length == 0) {
				$(el).addClass('no-next');
			}
		},

		show: function(el, e) {
			var that = this;

			var data = $(el).data();

			$('html').addClass('popup-visible');

			//set new era
			era = data.era;

			this.find(data.period, function(el) {
				period = el;
				that.render(el, function(e,bg) {
					that.animate.fromRight(e, 'popup');
					that.animate.fromRight(bg, 'background');
					that.checkOrder(e);
				});
			});
		},

		next: function() {
			var current = $('.popup.visible');
			var currentBg = $('.visible', backgrounds);

			var that = this;
			period = period.next();

			this.render(period, function(el, bg) {
				that.animate.toLeft(current, 'popup');
				that.animate.fromRight(el, 'popup');

				that.animate.toLeft(currentBg, 'background');
				that.animate.fromRight(bg, 'background');

				that.checkOrder(el);
			});
		},

		prev: function() {
			var current = $('.popup.visible');
			var currentBg = $('.visible', backgrounds);

			var that = this;
			period = period.prev();

			this.render(period, function(el, bg) {
				that.animate.toRight(current, 'popup');
				that.animate.fromLeft(el, 'popup');

				that.animate.toRight(currentBg, 'background');
				that.animate.fromLeft(bg, 'background');

				that.checkOrder(el);
			});
		},

		render: function(el, cb) {

			var obj = {
				title: $('title', el).text(),
				wiki: $('wiki', el).text(),
				description: $('description', el).text().trim()
			};

			var image = $('image', el).text();
			var folder = era.replace(' ','-').toLowerCase();
			image = config.imageDir + folder + '/' + image;

			var background = $('#period-background').text().trim();
			var template = $('#period-popup').text().trim();

			require(['helpers/renderer'], function(render) {

				var bg = $(render(background, {image:image}));
				var popup = $(render(template, obj));

				backgrounds.append(bg);
				container.append(popup);

				popup.css({marginTop:popup.outerHeight() / 2 *- 1});

				if (typeof cb == "function") {
					cb(popup, bg);
				}
			});
		},

		animate: {
			fromRight: function(el, type) {
				var timing = config.timing[type];
				var pos = config.positions[type];

				$(el).css({left:pos.right});
				$(el).animate({left:pos.middle}, timing, function() {
					$(el).addClass('visible');
				});
			},

			fromLeft: function(el, type) {
				var timing = config.timing[type];
				var pos = config.positions[type];

				$(el).css({left:pos.left});
				$(el).animate({left:pos.middle}, timing, function() {
					$(el).addClass('visible');
				});
			},

			toLeft: function(el, type) {
				var timing = config.timing[type];
				var pos = config.positions[type];

				$(el).animate({left:pos.left}, timing, function() {
					$(el).remove();
				});
			},

			toRight: function(el, type) {
				var timing = config.timing[type];
				var pos = config.positions[type];

				$(el).animate({left:pos.right}, timing, function() {
					$(el).remove();
				});
			},

		}
	}

});