/**
 * MyCashflow Default Theme
 * Copyright (c) 2021 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';

	var Modals = {
		fancyboxDefaults: {
			dragToClose: false,
			autoFocus: false,
			l10n: {
				CLOSE: MCF.dictionary.Close,
				NEXT: MCF.dictionary.Next,
				PREV: MCF.dictionary.Prev
			},
			Toolbar: {
				display: [
					"close",
				],
			},
			on: {
				initLayout: (fancybox, slide) => {
					$(fancybox.$container).addClass('CustomModal');
				},
			}
		},

		init: function (config) {
			$.extend(true, this, config);
			Fancybox.bind('[data-fancybox]', this.fancyboxDefaults);
		}
	};
	
	$.extend(true, window, { MCF: { Modals: Modals }});
})(jQuery);
