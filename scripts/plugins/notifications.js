/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	function Notification(type, html) {
		$('.NotificationCenter').removeAttr('aria-hidden');
		this.$elem = $('<div class="Notification"/>')
			.data('notification', this)
			.html(html)
			.addClass(type)
			.attr({
				role: 'status',
				'aria-live': 'polite',
				'aria-atomic': 'true'
			})
		if (!$('.NotificationCenter > .' + type + 'Group').length) {
			$('<div />')
				.addClass(type + 'Group')
				.prependTo($('.NotificationCenter'));
		}
		this.$elem
			.prependTo($('.NotificationCenter > .' + type + 'Group'))
			.parent().css('min-height', this.$elem.outerHeight());
	}

	Notification.prototype.hide = function () {
		var $this = this.$elem;
		$this.addClass('AnimOut');
		setTimeout(function() {
			$this.remove();
			if (!$('.NotificationCenter .Notification').length) {
				$('.NotificationCenter').attr('aria-hidden', true);
			}
		}, 300);
	};

	var Notifications = {
		timeToLive: 3000,
		hideTimeouts: [],

		init: function (config) {
			$.extend(true, this, config);
			var $notificationCenters = $('.NotificationCenter');
			if (!$notificationCenters.length) {
				$('<div class="NotificationCenter" aria-hidden="true"/>').appendTo(document.body);
			}
		},

		createFromElements: function ($notifications) {
			$notifications.each($.proxy(function (index, notification) {
				this.createFromElement($(notification));
			}, this));
		},

		createFromElement: function ($notification) {
			if ($notification.is('.Success')) {
				this.success($notification.html());
			} else if ($notification.is('.Error')) {
				this.error($notification.html());
			}
		},

		createFromHtml: function (html) {
			var $notifications = $('<div/>').html(html).find('.Notification');
			this.createFromElements($notifications);
		},

		createFromJson: function (json) {
			this.createFromElements($(json.notifications));
		},

		create: function (type, html) {
			var notification = new Notification(type, html);
			var hideTimeout = setTimeout($.proxy(function () {
				clearTimeout(this.hideTimeouts.shift());
				notification.hide();
			}, this), this.timeToLive);
			this.hideTimeouts.push(hideTimeout);
		},

		success: function (html) {
			return this.create('Success', html);
		},

		error: function (html) {
			return this.create('Error', html);
		},

		loading: function (html) {
			return this.create('Loading', html);
		},

		message: function (html) {
			return this.create(undefined, html);
		}
	};

	$.extend(true, window, { MCF: { Notifications: Notifications }});
})(jQuery);
