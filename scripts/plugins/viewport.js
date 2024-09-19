/**
 * MyCashflow Default Theme
 * Copyright (c) 2019 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';


	const Viewport = function (config) {
		$.extend(true, this, Viewport.defaults, config);
		this.observe();
	};

	Viewport.defaults = {
		observeRoot: null,
		observeElem: null,
		threshold: 0,
		rootMargin: '0px',
		isIntersecting: function () {},
		notIntersecting: function () {},
	};

	Viewport.prototype.observe = function () {
		const $elem = $(this.observeElem);
		const slideObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this.isIntersecting(entry.target);
				} else {
					this.notIntersecting(entry.target);
				}
			});
		}, { threshold: this.threshold, rootMargin: this.rootMargin, root: this.observeRoot });

		if ($elem.length) {
			$elem.each(function() {
				slideObserver.observe(this);
			});
		}
	};

	$.extend(true, window, { MCF: { Viewport: Viewport }});
})(jQuery);
