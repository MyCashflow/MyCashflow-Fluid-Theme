/**
 * MyCashflow Default Theme
 * Copyright (c) 2023 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
$(document).ready(function () {
	'use strict';

	MCF.Checkout.init({
		afterUpdate: function () {
			MCF.Theme.updateMiniCarts();
		},

		beforeUpdatePart: function ($part) {
			MCF.Loaders.show($('.ShowCartButton'));
			MCF.Loaders.show($part);
		},

		afterUpdatePart: function ($part) {
			MCF.CheckoutPaymentGroups.refresh();
			MCF.Loaders.hide($('.ShowCartButton'));
			MCF.Loaders.hide($part);
		}
	});

	MCF.CheckoutPaymentGroups.init({
		titleBank: MCF.dictionary.PaymentMethodsBank,
		titleCard: MCF.dictionary.PaymentMethodsCard,
		titleInvoice: MCF.dictionary.PaymentMethodsInvoice,
		titleMobile: MCF.dictionary.PaymentMethodsMobile,
		titleOther: MCF.dictionary.PaymentMethodsOther,
	});

	// Misc

	// Add placeholder text
	function addCampaignPlaceholderText(elem) {
		$(elem).each(function () {
			const $this = $(this);
			let text = $this.prev().text();
			if ($this.is('#CampaignCode')) {
				text = MCF.dictionary.CampaignCodeOrGiftCard || text;
			}
			$this.attr('placeholder', text);
		});
	}
	addCampaignPlaceholderText('#CampaignCode, #password');

	// Toggle/Open Cart
	$(document).on('click', '[data-toggle-cart]', function (evt) {
		$(evt.currentTarget).toggleClass('Active');
	});

	function openCartIfNotification() {
		if ($('.CheckoutCart .CampaignCodeForm:has(.Notification)').length) {
			$('[data-toggle-cart]').addClass('Active');
		}
	}
	openCartIfNotification();

	// Manipulate terms link
	$('.TermsLink').attr('data-fancybox', '').attr('data-type', 'ajax').attr('href', '/interface/Helper?file=helpers/modals/terms');

	// Thanks page registration form
	$('#CheckoutThanksRegistrationForm').insertBefore('#OrderFinished .OrderInfo');

});
