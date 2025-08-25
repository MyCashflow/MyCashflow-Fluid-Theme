/**
 * MyCashflow Default Theme
 * Copyright (c) 2015 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	const Theme = {
		init: function (config) {
			$.extend(true, this,  config);
			this.checkQuery();
			this.setScrollMargin();
			this.wrapTables();
			$(document.documentElement).removeClass('JS-Loading').addClass('JS-Loaded');
		},

		checkQuery: function () {
			const querystring = window.location.search;
			if (querystring) {
				const urlParams = new URLSearchParams(querystring);
				if (urlParams.has('search') || urlParams.has('per_page')) {
					$('body').addClass('QuerySearch');
				}
			}
		},

		setScrollMargin: function () {
			const $stickyMarginElem = $('.StickyNavbar, .StickyHeader, .HeaderMobile');
			$stickyMarginElem.each(function () {
				const $marginElem = $(this);
				if ($marginElem.is(':visible')) {
					let margin = $marginElem.outerHeight() + 20;
					$(':root').css('--scroll-margin-top', margin + 'px');
				}
			});
		},

		wrapTables: function () {
			$('table').wrap("<div class='TableScroll'></div>");
		}
	};

	$.extend(true, window, { MCF: { Theme: Theme }});
})(jQuery);
