/**
 * MyCashflow Default Theme
 * Copyright (c) 2021 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Clipboard = {
		init: function (config) {
			$.extend(true, this, config);
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('click', '[data-clipboard]', $.proxy(this.copy, this));
			$(document).on('click', '[data-selectall]', $.proxy(this.selectAll, this));
		},

		selectAll: function (evt, $target) {
			if (evt) {
				$target = $(evt.currentTarget);
			}
			$target[0].select();
			$target[0].setSelectionRange(0, 99999); /* For mobile devices */
		},

		copy: function (evt) {
			var $target = $($(evt.currentTarget).data('clipboard'));
			if ($target) {
				this.selectAll(undefined, $target);
				if (navigator.clipboard) {
					navigator.clipboard.writeText($target.val());
				}
			}
		}
	};
	
	$.extend(true, window, { MCF: { Clipboard: Clipboard }});
})(jQuery);
