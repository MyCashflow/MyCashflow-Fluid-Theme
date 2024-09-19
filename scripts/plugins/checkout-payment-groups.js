/**
 * MyCashflow Default Theme
 * Copyright (c) 2024 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	const CheckoutPaymentGroups = {
		paymentsSelector: '#CheckoutPaymentMethods',
		groupElem: '[data-payment-group]',
		groupOthers: true,

		titleBank: 'Pankkimaksutavat',
		titleCard: 'Korttimaksutavat',
		titleInvoice: 'Lasku- ja osamaksutavat',
		titleMobile: 'Mobiilimaksutavat',
		titleOther: 'Muut maksutavat',

		init: function (config) {
			$.extend(true, this, config);
			this.$methods = $(this.paymentsSelector);
			this.wrap();
		},

		wrap: function () {
			const $group = this.$methods.find(this.groupElem);
			if (!$group.length) {
				return false;
			}
			$group.each(function() {
				const $this = $(this);
				if ($this.parent().is('.PaymentMethodGroup')) {
					return;
				}
				const group = $this.data('payment-group');
				const $groupWrap = $('<div class="PaymentMethodGroup PaymentMenthodGroup-' + group + '" />');
				$this.nextAll('[data-payment-group="' + group + '"]').addBack().wrapAll($groupWrap);
				$('<h3 class="MethodGroupTitle" />').html(group).insertBefore('.PaymentMenthodGroup-' + group);
			});
			if (this.groupOthers) {
				this.wrapOthers();
			}
			this.renameTitles();
		},

		wrapOthers: function () {
			this.$methods.find('.Checks > .PaymentMethodWrapper').wrapAll('<div class="PaymentMethodGroup PaymentMethodGroup-other" />');
			if (!$('.PaymentMethodGroup-other').prev('h3').length) {
				$('<h3 class="MethodGroupTitle" />').html('other').insertBefore('.PaymentMethodGroup-other');
			}
		},

		renameTitles: function () {
			this.$methods.find('.MethodGroupTitle').each($.proxy(function (i, elem) {
				let title = $(elem).text();
				switch (title) {
					case 'mobile':
						title = this.titleMobile;
						break; 
					case 'bank':
						title = this.titleBank;
						break;
					case 'creditcard':
						title = this.titleCard;
						break;
					case 'credit':
						title = this.titleInvoice;
						break;
					case 'other':
						title = this.titleOther;
						break;
					default:
						title = title;
				}
				$(elem).html(title);
			}, this));
		},

		refresh: function () {
			this.wrap();
		}
	};

	$.extend(true, window, { MCF: { CheckoutPaymentGroups: CheckoutPaymentGroups }});
})(jQuery);
