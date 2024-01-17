/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Drawers = {
		beforeOpen: function () {},
		afterOpen: function () {},
		afterLoaded: function () {},

		init: function (config) {
			$.extend(true, this, config);
			this.$container = $(document.body).addClass('DrawerContainer');
			this.$overlay = $('<div class="DrawerOverlay"/>').appendTo(this.$container);
			this.$current = null;
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('click', $.proxy(this.onClose, this));
			$(document).on('click', '.Drawer', $.proxy(this.preventClose, this));
			$(document).on('click', '[data-drawer-close]', $.proxy(this.onClose, this));
			$(document).on('click', '[data-drawer-toggle]', $.proxy(this.onToggle, this));
			$(document).on('keyup', $.proxy(this.onEscape, this));
		},

		onClose: function () {
			this.close();
		},

		onEscape: function (evt) {
			if (evt.code === 'Escape') {
				this.close();
			}
		},

		onToggle: function (evt) {
			var $this = $(evt.currentTarget);
			var $target = $('[data-drawer="' + $this.attr('data-drawer-toggle') + '"]');
			this.toggleByName($this.attr('data-drawer-toggle'));
			$target.data('reference-link', $this);
			return false;
		},

		preventClose: function (evt) {
			evt.stopPropagation();
		},

		toggleByName: function (name) {
			var $drawer = $('[data-drawer="' + name + '"]');
			if ($drawer.length) {
				this.toggle($drawer);
			}
		},

		switch: function ($drawer) {
			MCF.Drawers.open($drawer);
		},

		toggle: function ($drawer) {
			if (!this.$current) {
				this.open($drawer);
			} else if (this.$current.data('drawer') == $drawer.data('drawer') == false) {
				this.switch($drawer);
			} else {
				this.close();
			}
		},

		open: function ($drawer) {
			this.$current = $drawer;
			this.beforeOpen($drawer);
			if ($('body').is('.RestrictedLogin')) {
				return false;
			}
			if ($drawer.is('[data-drawer-lazyload]')) {
				this.getContent($drawer.data('drawer'));
			}
			this.$overlay.addClass('Visible');
			this.preventScroll(true);
			this.$container.attr('data-drawer-open', $drawer.attr('data-drawer-side'));
			this.$current.addClass('Open').siblings().removeClass('Open');
			this.afterOpen($drawer);
		},

		close: function () {
			if (!this.$current) {
				return;
			}
			this.$overlay.removeClass('Visible');
			this.$container.removeAttr('data-drawer-open');
			this.$current.removeClass('Open');
			if (this.$current.data('reference-link')) {
				this.$current.data('reference-link').focus();
			}
			this.$current = null;
			this.preventScroll(false);
		},

		preventScroll: function (value) {
			if (value) {
				this.$container.data('position', $(window).scrollTop());
				$('body').addClass('BodyNoScroll').closest('html').addClass('ScreenLock');
				$('body')[0].scrollTo(0, this.$container.data('position'));
			} else {
				$('body').removeClass('BodyNoScroll').closest('html').removeClass('ScreenLock');
				window.scrollTo({ top: this.$container.data('position'), left: 0, behavior: 'instant' });
			}
		},

		getContent: function (name) {
			var $drawer = $('[data-drawer="' + name + '"]');
			if (!$drawer.is(':empty')) {
				$drawer.find('[data-drawer-close]').focus();
				return;
			}
			return $.get('/interface/Helper?file=/helpers/drawers/' + name)
				.then($.proxy(function (html) {
					$drawer.html(html);
					$drawer.addClass('Loaded');
					$drawer.find('[data-drawer-close]').focus();
					this.afterLoaded($drawer);
					this.afterOpen($drawer);
				}, this));
		},

		refresh: function (name) {
			var $drawer = $('[data-drawer="' + name + '"]');
			if (!$drawer.length) {
				return;
			}
			return $.get('/interface/Helper?file=/helpers/drawers/' + name)
				.then(function (html) {
					$drawer.html(html);
					var deferred = $.Deferred();
					setTimeout(deferred.resolve, 25);
					return deferred;
				});
		}
	};

	$.extend(true, window, { MCF: { Drawers: Drawers }});
})(jQuery);
