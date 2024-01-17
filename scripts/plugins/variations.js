/**
 * MyCashflow Default Theme
 * Copyright (c) 2021 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';
	
	var Variations = {
		selectedClass: 'SelectedCheck',
		variations: '.BuyFormVariationRadio',

		afterRadioItemClick: function () {},

		init: function (config) {
			$.extend(true, this, config);
			this.bindEvents();
			this.wrapRadioChecks();
		},

		bindEvents: function () {
			$(document).on('click', '.RadioCheck', $.proxy(this.onRadioItemClick, this));
		},

		wrapRadioChecks: function () {
			var $variations = $(this.variations);
			var selectedClass = this.selectedClass;
			$variations.find('.Checks').addClass('CustomRadioChecks');
			$variations.each(function() {
				var $label = $(this).find('.Checks > label');
				$label.each(function() {
					var $input = $(this).children('input');
					var $checkItem = $(this).next('p').addBack().wrapAll('<div class="RadioCheck"/>').parent();
					var disabled = $input.is(':disabled');
					var checked = $input.is(':checked');
					if (checked) {
						$checkItem.addClass(selectedClass);
					}
					if (disabled) {
						$checkItem.addClass('DisabledCheck');
					}
				});
			});
		},

		onRadioItemClick: function (evt) {
			var $checkItem = $(evt.currentTarget);
			var selectedClass = this.selectedClass;
			var disabled = $checkItem.find('input').is(':disabled');
			if (disabled) {
				return false;
			}
			$checkItem.addClass(selectedClass).siblings().removeClass(selectedClass);
			this.afterRadioItemClick(evt);
		}
	};
	
	$.extend(true, window, { MCF: { Variations: Variations }});
})(jQuery);
