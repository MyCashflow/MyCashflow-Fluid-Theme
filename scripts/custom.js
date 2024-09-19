/**
 * MyCashflow Default Theme
 * Copyright (c) 2021 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
$(document).ready(function () {
	'use strict';

	$.ajaxSetup({
		cache: false
	});

	// Init Plugins

	$.each([
		'Filters',
		'Loaders',
		'Navigations',
		'Notifications',
		'Spinners',
		'Sliders',
		'Versions'
	], function (index, name) {
		const plugin = MCF[name];
		if (plugin) {
			plugin.init();
		}
	});

	MCF.Theme.init({
		updateCarts: function () {
			return $.when([
				this.updateFullCart(),
				this.updateMiniCarts()
			]);
		},

		updateDiscountCodes: function () {
			const $codes = $('.CustomerDiscountCodes');
			let url = '/interface/Helper?file=helpers/discount-codes';
			if (!$codes.length) {
				return $.Deferred().resolve().promise();
			}
			return $.get(url)
				.then(function (html) {
					$codes.each(function () {
						$(this).replaceWith(html);
					});
				});
		},

		updateFullCart: function () {
			const $fullCart = $('.FullCart').first();
			if (!$fullCart.length) {
				return;
			}
			const $products = $fullCart.find('.Product');
			if ($products.length) {
				MCF.Loaders.show($fullCart);
			} else {
				$fullCart.remove();
				return;
			}
			return $.get('/interface/Helper?file=helpers/full-cart')
				.then(function (html) {
					$fullCart.html(html);
					MCF.Spinners.wrapInputs($fullCart);
					MCF.Loaders.hide($fullCart);
				});
		},

		updateMiniCarts: function () {
			const $miniCarts = $('.MiniCart');
			let url = '/interface/Helper?file=helpers/mini-cart';
			if (!$miniCarts.length) {
				return;
			}
			$miniCarts.each(function () {
				const $cart = $(this);
				const $drawer = $cart.closest('.Drawer');
				if ($cart.is(':visible') && !$drawer.length) {
					MCF.Loaders.show($cart);
				}
			});
			if ($miniCarts.is('.MiniCart-Checkout')) {
				url = '/interface/Helper?file=checkout/helpers/cart';
			}
			return $.get(url)
				.then(function (html) {
					$miniCarts.each(function () {
						const $cart = $(this);
						$cart.children(':not(.Loader)').remove();
						$cart.append(html);
						MCF.Spinners.wrapInputs($cart);
						MCF.Loaders.hide($cart);
					});
					MCF.Theme.updateTotals();
				});
		},

		updateTotals: function () {
			const cartItems = $('.MiniCart [data-cart-total-items]').data('cart-total-items');
			const cartSubTotal = $('.MiniCart [data-cart-sub-total]').data('cart-sub-total');
			$('.CartTotals').attr('data-cart-total-items', cartItems).attr('data-cart-sub-total', cartSubTotal);
			
			let wishlistItems = $('.Wishlist [data-wishlist-total-items]').data('wishlist-total-items');
			if (wishlistItems === undefined) {
				$.get('/interface/WishlistProductCount')
					.then(function (count) {
						updateWishlistTotal(count);
					});
			} else {
				updateWishlistTotal(wishlistItems);
			}
			function updateWishlistTotal(count) {
				$('.WishlistTotals').attr('data-wishlist-total-items', count);
			}
		},

		updateWishlist: function () {
			const $wishlist = $('.Wishlist');
			let url = '/interface/Helper?file=helpers/wishlist';
			return $.get(url)
				.then(function (html) {
					$wishlist.html(html);
					MCF.Theme.updateTotals();
				});
		},

		preventSend: function (ajaxSettings) {
			if ($('body').is('.RestrictedLogin')) {
				return true;
			}
		},

		skipNotifications: function (ajaxSettings) {
			// Skip spam when filling checkout address information.
			const $focused = $('#CheckoutBillingAddress, #CheckoutShippingAddress').find(':focus');
			if (ajaxSettings.url === '/checkout/' && $focused.length) {
				return true;
			}
			// Skip duplicate notifications on cart page.
			if ($('body').is('.Cart') && ajaxSettings.url.indexOf('/full-cart') >= 0) {
				return true;
			}
			// Skip notifications when loading drawer.
			if (ajaxSettings.url.indexOf('file=/helpers/drawers/') >= 0) {
				return true;
			}
		}
	});

	MCF.CampaignCode.init({
		beforeSubmit: function ($form) {
			if (!Fancybox.getInstance()) {
				MCF.Loaders.show($form);
			}
		},

		afterSubmit: function ($form) {
			if (!Fancybox.getInstance()) {
				MCF.Loaders.hide($form);
			}
			Fancybox.close();
			if ($('body').is('.Checkout')) {
				location.reload();
				return;
			}
			MCF.Theme.updateDiscountCodes()
				.then(function () {
					MCF.Theme.updateCarts();
					MCF.Drawers.refresh('gift-cards');
					if (MCF.Drawers.$current.is('[data-drawer="gift-cards"]')) {
						MCF.Drawers.toggle($('[data-drawer="cart"]'));
					}
				});
		}
	});

	MCF.Cart.init({
		beforeUpdate: function ($cart) {
			MCF.Loaders.show($cart);
		},

		afterUpdate: function ($cart) {
			MCF.Loaders.hide($cart);
			MCF.Theme.updateCarts();
		},

		beforeAddProduct: function ($buyForm) {
			MCF.Loaders.show($buyForm);
		},

		afterAddProduct: function ($buyForm) {
			MCF.Loaders.hide($buyForm);
			MCF.Theme.updateCarts()
				.then(function () {
					if (MCF.Drawers.$current === null) {
						MCF.Drawers.toggleByName('cart');
					}
				});
		},

		beforeRemoveProduct: function ($removeLink) {
			const $product = $removeLink.closest('.Product');
			$product.fadeOut('fast');
		},

		afterRemoveProduct: function () {
			MCF.Theme.updateCarts();
		}
	});

	MCF.Drawers.init({
		afterLoaded: function ($drawer) {
			if ($drawer.is('[data-drawer="cart"]')) {
				MCF.Theme.updateMiniCarts();
			}
			if ($drawer.is('[data-drawer^="menu"]')) {
				MCF.Navigations.addActiveClasses($drawer.find('.NavigationList'));
				MCF.Navigations.addExpanders($drawer.find(MCF.Navigations.navigations));
				MCF.Navigations.expandCurrent($drawer.find(MCF.Navigations.navigations));
				MCF.Navigations.addShowAll($drawer.find(MCF.Navigations.navigations));
			}
		},

		afterDone: function ($drawer) {
			if ($drawer.is('[data-drawer="search"]')) {
				$drawer.find('[type="search"]').focus();
			}
		}
	});

	MCF.Modals.init({
		fancyboxDefaults: {
			dragToClose: false,
			autoFocus: true,
			l10n: {
				CLOSE: MCF.dictionary.Close,
				NEXT: MCF.dictionary.Next,
				PREV: MCF.dictionary.Prev
			},
			on: {
				initLayout: (fancybox) => {
					// Do something with $(fancybox.container)
				},
			}
		}
	});

	new MCF.Viewport({
		observeElem: '.SiteTop',

		isIntersecting: function (observeElem) {
			$('body').removeClass('OffsetTop');
		},

		notIntersecting: function (observeElem) {
			$('body').addClass('OffsetTop');
		}
	});

	new MCF.Viewport({
		observeElem: '[data-viewport-lazyload]',
		rootMargin: '200px 0px',

		isIntersecting: function (observeElem) {
			let helper = $(observeElem).data('viewport-lazyload');
			if (helper) {
				let url = '/interface/Helper?file=/' + helper;
				$.get(url)
					.then(function (html) {
						const $newElem = $(html);
						$(observeElem).replaceWith($newElem);
						MCF.Sliders.init();
						MCF.Wishlist.addTitles();
					});
			}
		}
	});

	MCF.Wishlist.init({
		beforeWishlistToggle: function ($form, type) {
			const $product = $form.closest('.WishlistProduct');
			if (type === 'remove' && $product.length) {
				$product.fadeOut('fast');
			}
			MCF.Loaders.show($form);
		},

		afterWishlistToggle: function ($form, type, data) {
			MCF.Loaders.hide($form);
			const productName = $.trim($form.parent('[data-product-name]').data('product-name'));
			let notificationText = type === 'add' ? MCF.dictionary.WishlistProductAdded : MCF.dictionary.WishlistUpdated;
			productName ? notificationText = notificationText.replace('PRODUCT_NAME', productName) : notificationText = MCF.dictionary.WishlistUpdated;
			MCF.Notifications.success(notificationText);
		},

		afterFormUpdate: function (html) {
			MCF.Theme.updateWishlist();
		}
	});

	//------------------------------------------------------------------------------
	// Global Ajax Event Handlers
	//------------------------------------------------------------------------------

	$(document).on('ajaxSend', function (evt, xhr, settings) {
		if (MCF.Theme.preventSend(settings)) {
			xhr.abort();
			return;
		}
	});

	$(document).on('ajaxSuccess', function (evt, xhr, settings) {
		if (MCF.Theme.skipNotifications(settings)) {
			return;
		}
		let json;
		try {
			json = $.parseJSON(xhr.responseText);
		} catch (e) {
			MCF.Notifications.createFromHtml(xhr.responseText);
		}
		if (json && json.notifications) {
			MCF.Notifications.createFromJson(json);
		}
	});

	//------------------------------------------------------------------------------
	// Image Lightness
	//------------------------------------------------------------------------------

	// https://stackoverflow.com/questions/13762864/image-brightness-detection-in-client-side-script

	function getImageLightness(imageSrc, callback) {
		var img = document.createElement("img");
		img.src = imageSrc;
		img.style.display = "none";
		document.body.appendChild(img);

		var colorSum = 0;

		img.onload = function() {
			// create canvas
			var canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(this,0,0);

			var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
			var data = imageData.data;
			var r,g,b,avg;

			for(var x = 0, len = data.length; x < len; x+=4) {
					r = data[x];
					g = data[x+1];
					b = data[x+2];

					avg = Math.floor((r+g+b)/3);
					colorSum += avg;
			}

			var brightness = Math.floor(colorSum / (this.width*this.height));
			callback(brightness);
		}
	}

	$('.MainBanner, .FeaturedBanner, .Newsletter').each(function() {
		const $banner = $(this);
		const $img = $banner.find('img');
		if (!$img.length) {
			return;
		}
		const imgSrc = $img.attr('src');
		const $text = $banner.find('.BannerText, .NewsletterInfo');
		getImageLightness(imgSrc, function(brightness) {
			if (brightness > 112) {
				$text.closest('article').addClass('Banner-Light');
			} else {
				$text.closest('article').addClass('Banner-Dark');
			}
		});
		$text.addClass('LightnessLoaded');
	});

	//------------------------------------------------------------------------------
	// Newsletter Subscribe Form Modifications
	//------------------------------------------------------------------------------

	function addInputPlaceholder($elem, required) {
		$elem.each(function () {
			const $this = $(this);
			$this.attr('placeholder', $this.prev('label').text());
			if (required) {
				addRequiredAttr($this);
			}
		});
	}

	function addRequiredAttr($input) {
		$input.prop('required', true);
	}

	addInputPlaceholder($('#SubscribeEmail, #UnsubscribeEmail'), 'required');

	//------------------------------------------------------------------------------
	// Misc
	//------------------------------------------------------------------------------

	$(document).on('click', function (evt) {
		// Close details when clicking outside them
		// Close filter lists when clicking outside them
		const $parents = $(evt.target).parents('[data-details-global-toggle][open], .FilterGroup.Navigable');
		if ($parents.length) {
			return;
		}
		$('[data-details-global-toggle][open]').removeAttr('open');
		$('.FilterGroup.Navigable').removeClass('Navigable');
	});

	$(document).on('change', '[data-auto-submit]', function (evt) {
		$(evt.currentTarget).closest('form').submit();
	});

	$(document).on('click', '[data-toggle-visible-link]', function (evt) {
		evt.preventDefault();
		const target = $(evt.currentTarget).attr('href');
		$(target).toggle();
	});

});
