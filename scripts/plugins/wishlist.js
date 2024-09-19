/**
 * MyCashflow Default Theme
 * Copyright (c) 2024 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';
	
	const Wishlist = {

		beforeWishlistToggle: function () {},
		afterWishlistToggle: function () {},
		afterFormUpdate: function () {},

		init: function (config) {
			$.extend(true, this, config);
			this.bindEvents();
			this.addTitles();
		},

		bindEvents: function () {
			$(document).on('submit', '[action*="/account/wishlist/items/"]', $.proxy(this.onWishlistSubmit, this));
		},

		addTitles: function () {
			$('.AddToWishlist').each(function () {
				$(this).attr('title', $.trim($(this).text()));
			});
		},

		onWishlistSubmit: function (evt) {
			evt.preventDefault();
			this.submit($(evt.currentTarget));
		},

		submit: function ($form) {
			let type = $form.is('[action="/account/wishlist/items/add"]') ? 'add' : 'remove';
			this.beforeWishlistToggle($form, type);
			const data = $form.serializeArray().concat([
				{ name: 'ajax', value: 1 },
				{ name: 'response_type', value: 'json' }
			]);
			$.post($form.attr('action'), data)
				.then($.proxy(function () {
					this.updateForm($form);
					this.afterWishlistToggle($form, type, data);
				}, this));
		},

		updateForm: function ($form) {
			const productId = $form.find('[name="product_id"]').val();
			$form = $form.add('.ProductWishlistToggle:has([value="' + productId + '"])');
			$.get('/interface/ProductWishlistToggle?setProduct=' + productId)
				.then($.proxy(function (html) {
					$form.replaceWith(html);
					this.addTitles();
					this.afterFormUpdate(html);
				}, this));
		}
	};
	
	$.extend(true, window, { MCF: { Wishlist: Wishlist }});
})(jQuery);
