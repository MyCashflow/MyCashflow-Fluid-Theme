/**
 * MyCashflow Default Theme
 * Copyright (c) 2021 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';

	const Modals = {
		fancyboxDefaults: {
			dragToClose: false
		},

		init: function (config) {
			$.extend(true, this, config);
			Fancybox.bind('[data-fancybox]', this.fancyboxDefaults);
		}
	};
	
	$.extend(true, window, { MCF: { Modals: Modals }});
})(jQuery);
