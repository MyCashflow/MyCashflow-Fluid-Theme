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
			const cartOpenTotal = $('.MiniCart [data-cart-open-total]').data('cart-open-total');
			$('.CartTotals').attr('data-cart-total-items', cartItems).attr('data-cart-sub-total', cartSubTotal);
			$('.Checkout .ShowCartTotal').attr('data-cart-open-total', cartOpenTotal);
			
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
				done: (fancybox, slide) => {
					const $form = $(fancybox.container).find('.RecaptchaForm');
					if ($form.length) {
						onRecaptchaLoadCallback();
					} 
				}
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
	// Add Keyboard Support to Hover Navigation
	//------------------------------------------------------------------------------

	function addKeyboardSupport($nav) {
		$nav.find('[class*="HasSub"]').each(function () {
			const $this = $(this);
			const $link = $this.children('a');
			const $openCategory = $('<li />').addClass('CategoryShowAll');
			const $openCategoryLink = $('<a />')
				.text(MCF.dictionary.OpenCategory)
				.attr('href', $link.attr('href'))
				.prependTo($openCategory);
			$openCategory.prependTo($(this).find('ul').first());

			$link.attr({
				'role': 'button',
				'aria-haspopup': 'true',
				'aria-expanded': 'false',
			});
		});

		$nav.on('keydown', 'a', function (evt) {
			const $ul = $(evt.currentTarget).closest('ul');
			const $link = $(evt.currentTarget);
			const $parentLi = $link.parent('li');
			const $topParent = $link.parents('li').last();

			if (evt.key === 'Escape') {
				evt.preventDefault();
				closeAllSubMenus();
				return;
			}

			if ($parentLi.is('[class*="HasSub"]')) {
				if (evt.key === 'Enter' || evt.key === ' ') {
					evt.preventDefault();
					subMenuToggle();
				}
			}

			function subMenuToggle() {
				$parentLi.find('.Open').removeClass('Open'); // Close any open submenus
				$parentLi.toggleClass('Open').siblings().removeClass('Open').find('.Open').removeClass('Open');
				$link.attr('aria-expanded', $parentLi.hasClass('Open'));
			}

			function closeAllSubMenus() {
				$nav.find('.Open').removeClass('Open');
				$nav.find('a').attr('aria-expanded', 'false');
				$topParent.children('a').focus();
			}
		});
	}
	addKeyboardSupport($('[data-navigation-hover-kb-support]'));

	//------------------------------------------------------------------------------
	// Banner Text Color
	//------------------------------------------------------------------------------

	// Set the color of the banner title based on the first color found in the banner text.
	$('.MainBanner, .FeaturedBanner').each(function() {
		const $banner = $(this);
		const $text = $banner.find('.BannerText');
		const color = $text.find('[style*="color"]').first().css('color');
		if (color) {
			$banner.find('.Title').css('color', color);
		}
	});

	//------------------------------------------------------------------------------
	// Banner Text Link to Button
	//------------------------------------------------------------------------------

	$('.MainBanner, .FeaturedBanner').each(function() {
		const $banner = $(this);
		const $link = $banner.find('.TextButtons-1 :last-child > a');
		if ($link.length) {
			$link.addClass('Button');
		}
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

	$('#NewsletterSubscribeForm [name="b_accept"]').attr('aria-hidden', 'true').attr('tabindex', '-1');

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
		$('[data-navigation-hover-kb-support]').find('.Open').removeClass('Open').attr('aria-expanded', 'false');
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
