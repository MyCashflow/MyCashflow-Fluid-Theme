/**
 * MyCashflow Default Theme
 * Copyright (c) 2024 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	const CampaignCode = {

		beforeSubmit: function () {},
		afterSubmit: function () {},

		init: function (config) {
			$.extend(true, this, config);
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('submit', '.CustomerDiscountCodeToggle[action*="/cart"]', $.proxy(this.onCodeToggleSubmit, this));
			$(document).on('submit', '.CampaignCodeForm [action*="/cart"]', $.proxy(this.onCampaignSubmit, this));
			$(document).on('submit', '.RemoveGiftCardForm[action*="/cart/gift-cards/"]', $.proxy(this.onRemoveGiftCardSubmit, this));
		},

		onCodeToggleSubmit: function (evt) {
			const $form = $(evt.currentTarget);
			evt.preventDefault();
			this.submit($form);
		},

		onCampaignSubmit: function (evt) {
			const $form = $(evt.currentTarget);
			evt.preventDefault();
			this.submit($form);
		},

		onRemoveGiftCardSubmit: function (evt) {
			const $form = $(evt.currentTarget);
			evt.preventDefault();
			this.submit($form);
		},

		submit: function ($form) {
			this.beforeSubmit($form);
			const data = $form.serializeArray().concat([
				{ name: 'ajax', value: 1 },
				{ name: 'response_type', value: 'json' }
			]);
			return $.post($form.attr('action'), data)
				.then($.proxy(function () {
					this.afterSubmit($form);
				}, this));
		}
 	};

	$.extend(true, window, { MCF: { CampaignCode: CampaignCode }});
})(jQuery);
