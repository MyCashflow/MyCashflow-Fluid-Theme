/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Drawers = {
		refererButtonSelector: '[data-drawer-previous]',
		closeButtonSelector: '[data-drawer-close]',

		beforeOpen: function () {},
		afterOpen: function () {},
		afterLoaded: function () {},
		afterRefresh: function () {},
		afterDone: function () {},

		init: function (config) {
			$.extend(true, this, config);
			this.$container = $(document.body).addClass('DrawerContainer');
			this.$overlay = $('<div class="DrawerOverlay"/>').appendTo(this.$container);
			this.$current = null;
			this.$referer = null;
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('click', $.proxy(this.onClose, this));
			$(document).on('click', '.Drawer', $.proxy(this.preventClose, this));
			$(document).on('click', this.closeButtonSelector, $.proxy(this.onClose, this));
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
			this.$referer = $this;
			this.toggleByName($this.attr('data-drawer-toggle'));
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
			this.$overlay.addClass('Visible');
			this.preventScroll(true);
			this.$container.attr('data-drawer-open', $drawer.attr('data-drawer-side'));
			this.$current.addClass('Open').siblings().removeClass('Open');
			var loaded = this.getContent($drawer.data('drawer'));
			this.afterOpen($drawer);
			if (loaded === false) {
				this.done($drawer);
			}
		},

		getContent: function (name) {
			var $drawer = $('[data-drawer="' + name + '"]');
			if ($drawer.is(':not(:empty)') || $drawer.is(':not([data-drawer-lazyload])')) {
				return false;
			}
			return $.get('/interface/Helper?file=/helpers/drawers/' + name)
				.then($.proxy(function (html) {
					$drawer.html(html);
					$drawer.addClass('Loaded');
					this.afterLoaded($drawer);
					this.done($drawer);
				}, this));
		},

		done: function ($drawer) {
			$drawer.find(this.closeButtonSelector).focus();
			if (this.$referer) {
				this.setReferer($drawer);
			}
			this.afterDone($drawer);
		},

		close: function () {
			if (!this.$current) {
				return;
			}
			this.$overlay.removeClass('Visible');
			this.$container.removeAttr('data-drawer-open');
			this.$current.removeClass('Open');
			this.$current = null;
			this.preventScroll(false);
			this.clearReferer();
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
					this.afterRefresh();
					return deferred;
				});
		},

		setReferer: function ($drawer) {
			var $refererDrawer = this.$referer.parents('.Drawer');
			var $refererButton = $drawer.find(this.refererButtonSelector);
			if (!$refererDrawer.length || !$refererButton.length) {
				return;
			}
			var referer = $refererDrawer.data('drawer');
			var refererName = $refererDrawer.find('.DrawerHeader .Title').text();
			if (refererName) {
				$refererButton.attr('aria-label', refererName);
			}
			$refererButton.attr('data-drawer-toggle', referer).removeAttr('hidden');
		},

		clearReferer: function () {
			if (!this.$referer === null) {
				if (!this.$referer.parents('.Drawer').length) {
					this.$referer.focus();
				}
			}
			this.$referer = null;
			$(this.refererButtonSelector).attr('hidden', 'hidden');
		}
	};

	$.extend(true, window, { MCF: { Drawers: Drawers }});
})(jQuery);
