/**
 * MyCashflow Default Theme
 * Copyright (c) 2023 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
$(document).ready(function () {
	'use strict';

	$.ajaxSetup({
		cache: false
	});

	MCF.Checkout.init({
		afterUpdate: function () {
			MCF.Theme.updateMiniCarts();
		},

		beforeUpdatePart: function ($part) {
			MCF.Loaders.show($('.ShowCartButton'));
			MCF.Loaders.show($part);
		},

		afterUpdatePart: function ($part) {
			MCF.Loaders.hide($('.ShowCartButton'));
			MCF.Loaders.hide($part);
		}
	});

	// Misc

	// Add placeholder text
	function addCampaignPlaceholderText(elem) {
		$(elem).each(function () {
			$(this).attr('placeholder', $(this).prev().text());
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

	// Responsive table
	$.fn.tableOverflow = function() {
		var tableWidth = $(this).width();
		var wrapWidth = $(this).closest('.TableWrap').width();
		if (tableWidth > wrapWidth) {
			$(this).closest('.TableWrap').addClass('TableOverflow');
		} else {
			$(this).closest('.TableWrap').removeClass('TableOverflow');
		}
	};

	$('table').each(function() {
		$(this).wrap("<div class='TableWrap'><div class='TableScroll'></div></div>");
		$(this).tableOverflow();
	});

	addEventListener('resize', (event) => {
		$('table').each(function() {
			$(this).tableOverflow();
		});
	});

});
