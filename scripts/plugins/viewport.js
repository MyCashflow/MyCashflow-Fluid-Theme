/**
 * MyCashflow Default Theme
 * Copyright (c) 2019 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';
	
	var Viewport = {
		siteTopElem: '.SiteTop',
		sliderElem: '[data-viewport-lazyload]',

		init: function (config) {
			$.extend(true, this, config);
			this.observeTop();
		},

		observeTop: function () {
			var siteTopElem = this.siteTopElem;
			var sliderElem = this.sliderElem;
			var slideObserver = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						if ($(entry.target).is(siteTopElem)) {
							$('body').removeClass('OffsetTop');
						}
						if ($(entry.target).is(sliderElem) && $(entry.target).find('.SectionPlaceholder').length) {
							this.loadHelpers($(entry.target));
						}
					} else {
						if ($(entry.target).is(siteTopElem)) {
							$('body').addClass('OffsetTop');
						}
					}
				});
			}, { threshold: 0 });

			$(this.sliderElem).add(this.siteTopElem).each(function() {
				slideObserver.observe(this);
			});
		},

		loadHelpers: function ($entry) {
			if (!$entry.length) {
				return;
			}
			var helper = $entry.data('viewport-lazyload');
			var interfaceUrl = '/interface/Helper?file=/' + helper;
			$.get(interfaceUrl)
				.then(function (html) {
					$entry.replaceWith(html);
					MCF.Sliders.init();
				});
		}
	};
	
	$.extend(true, window, { MCF: { Viewport: Viewport }});
})(jQuery);
