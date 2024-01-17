/**
 * MyCashflow Default Theme
 * Copyright (c) 2015 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Theme = {
		init: function (config) {
			$.extend(true, this,  config);
			this.checkQuery();
			$(document.documentElement).removeClass('JS-Loading').addClass('JS-Loaded');
		},

		checkQuery: function () {
			var querystring = window.location.search;
			if (querystring) {
				$('body').addClass('QuerySearch');
			}
		}
	};

	$.extend(true, window, { MCF: { Theme: Theme }});
})(jQuery);
