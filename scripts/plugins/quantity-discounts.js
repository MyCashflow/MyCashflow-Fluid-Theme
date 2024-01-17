/**
 * MyCashflow Default Theme
 * Copyright (c) 2021 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';

	const QuantityDiscounts = {
		discountsList: '.ProductQuantityDiscounts',

		init: function (config) {
			$.extend(true, this, config);
			this.$quantityDiscounts = $(this.discountsList);
			this.manipulateLists();
		},

		manipulateLists: function () {
			this.$quantityDiscounts.each(function() {
				const $this = $(this);
				const price = $this.data('product-list-price') * 1;
				const prefix = $this.data('prefix');
				const suffix = $this.data('suffix');
	
				$('dt', $this).each(function() {
					const $this = $(this);
					const $next = $(this).next('dd');
					const discountPrice = parseFloat($next.text().replace(/\s/g, '').replace(',', '.'));
					const round = (discountPrice * 100) / (price * 100);
					const discountPercentage = Math.floor(100 - (round) * 100);
					if (price <= discountPrice) {
						$this.hide().next().hide();
						return;
					}

					if (discountPercentage < 1) {
						return;
					}
	
					$this.prepend(prefix + ' ');
					$next.append(' ' + suffix);
					$('<span>')
						.html('-' + discountPercentage + '%')
						.addClass('QuantityDiscountPercentage')
						.appendTo($next);
				});
				$this.addClass('Visible');
			});
		}
	};
	
	$.extend(true, window, { MCF: { QuantityDiscounts: QuantityDiscounts }});
})(jQuery);
