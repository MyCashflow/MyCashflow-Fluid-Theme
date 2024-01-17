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
		'Modals',
		'Navigations',
		'Notifications',
		'Spinners',
		'Sliders',
		'Versions',
		'Viewport'
	], function (index, name) {
		var plugin = MCF[name];
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

		updateFullCart: function () {
			var $fullCart = $('.FullCart').first();
			if (!$fullCart.length) {
				return;
			}
			var $products = $fullCart.find('.Product');
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
			var $miniCarts = $('.MiniCart');
			var url = '/interface/Helper?file=helpers/mini-cart';
			if (!$miniCarts.length) {
				return;
			}
			$miniCarts.each(function () {
				var $cart = $(this);
				var $drawer = $cart.closest('.Drawer');
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
						var $cart = $(this);
						$cart.children(':not(.Loader)').remove();
						$cart.append(html);
						MCF.Spinners.wrapInputs($cart);
						MCF.Loaders.hide($cart);
					});
					updateCartTotals();
					// window.Klarna.OnsiteMessaging.refresh();
				});
		},

		skipNotifications: function (ajaxSettings) {
			// Skip spam when filling checkout address information.
			var $focused = $('#CheckoutBillingAddress, #CheckoutShippingAddress').find(':focus');
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
			var $miniCarts = $('.MiniCart');
			if (!$miniCarts.length) {
				MCF.Drawers.toggleByName('cart');
			} else {
				MCF.Theme.updateMiniCarts()
				.then(function () {
					MCF.Drawers.toggleByName('cart');
				});
			}
		},

		beforeRemoveProduct: function ($removeLink) {
			var $product = $removeLink.closest('.Product');
			$product.fadeOut('fast');
		},

		afterRemoveProduct: function () {
			MCF.Theme.updateCarts();
		}
	});

	MCF.Drawers.init({
		afterLoaded: function ($drawer) {
			if ($drawer.is('[data-drawer="cart"]')) {
				MCF.Spinners.wrapInputs($drawer);
				updateCartTotals();
				window.Klarna.OnsiteMessaging.refresh();
			}
			if ($drawer.is('[data-drawer^="menu"]')) {
				MCF.Navigations.addActiveClasses($drawer.find('.NavigationList'));
				MCF.Navigations.addExpanders($drawer.find(MCF.Navigations.navigations));
				MCF.Navigations.expandCurrent($drawer.find(MCF.Navigations.navigations));
				MCF.Navigations.addShowAll($drawer.find(MCF.Navigations.navigations));
			}
		},
		afterOpen: function ($drawer) {
			if ($drawer.is('[data-drawer="search"]')) {
				$drawer.find('[type="search"]').focus();
			}
		}
	});

	function updateCartTotals() {
		const items = $('.MiniCart [data-cart-total-items]').data('cart-total-items');
		const subTotal = $('.MiniCart [data-cart-sub-total]').data('cart-sub-total');
		$('.CartTotals').attr('data-cart-total-items', items).attr('data-cart-sub-total', subTotal);
	}

	$(document).on('ajaxSuccess', function (evt, xhr, settings) {
		if (MCF.Theme.skipNotifications(settings)) {
			return;
		}
		var json;
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
		var $banner = $(this);
		var imgSrc = $banner.find('img').attr('src');
		var $text = $banner.find('.BannerText, .NewsletterInfo');
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
	// Global Close
	//------------------------------------------------------------------------------

	$(document).on('click', function (evt) {
		// Close details when clicking outside them
		// Close filter lists when clicking outside them
		var $parents = $(evt.target).parents('[data-details-global-toggle][open], .FilterGroup.Navigable');
		if ($parents.length) {
			return;
		}
		$('[data-details-global-toggle][open]').removeAttr('open');
		$('.FilterGroup.Navigable').removeClass('Navigable');
	});

	//------------------------------------------------------------------------------
	// Sticky SideNavigation
	//------------------------------------------------------------------------------

	function countStickyHeight() {
		var $stickyMarginElem = $('.StickyNavbar, .StickyHeader');
		var $stickyElem = $('.StickySide');
		$stickyMarginElem.each(function () {
			let height = $(this).outerHeight();
			$stickyElem.css('top', height + 20);
			return false;
		});
	}
	countStickyHeight();

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

	addInputPlaceholder($('#SubscribeEmail'), 'required');

	//------------------------------------------------------------------------------
	// Misc
	//------------------------------------------------------------------------------

	$(document).on('change', '[data-auto-submit]', function (evt) {
		$(evt.currentTarget).closest('form').submit();
	});

	$(document).on('click', '[data-toggle-visible-link]', function (evt) {
		evt.preventDefault();
		var target = $(evt.currentTarget).attr('href');
		$(target).toggle();
	});

});
