/**
 * MyCashflow Default Theme
 * Copyright (c) 2022 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';

	const Accordion = {
		selector: '',
		accordionClass: 'Accordion',
		tabMode: false,
		scrollTo: false,

		init: function (config) {
			$.extend(true, this, config);
			this.assignAccordions();
			this.createAccordions();
			this.bindEvents();
		},

		bindEvents: function () {
			$(document).on('click', '.' + this.accordionClass + ' summary', $.proxy(this.onTitleClick, this));
		},

		assignAccordions: function () {
			const accordionClass = this.accordionClass;
			$(this.selector).each(function() {
				if ($(this).parents('.' + accordionClass).length) {
					return;
				}
				if (!$(this).is('[data-accordion]')) {
					$(this).attr('data-accordion', '');
				}
			});
		},

		createAccordions: function () {
			const accordionClass = this.accordionClass;
			$('[data-accordion]').each(function() {
				const $title = $(this);
				$title.nextUntil('[data-accordion]').addBack().wrapAll('<details class="' + accordionClass + '" />');
				$title.wrap('<summary/>');
				if ($title.data('accordion') == 'expanded') {
					$title.closest('details').attr('open', true);
				}
			});
		},

		onTitleClick: function (evt) {
			const $accordionWrap = $(evt.currentTarget).parent();
			if (this.tabMode && !$accordionWrap.is('[open]')) {
				$(evt.currentTarget).siblings('details').removeAttr('open');
			}
			if (this.scrollTo && !$accordionWrap.is('[open]')) {
				var headerHeight = $('.SiteHeader')[0].offsetHeight || 130;
				var position = $accordionWrap[0].offsetTop - headerHeight - 20;
				window.scrollTo({top: position, behavior: 'smooth'});
			}
		}
	};
	
	$.extend(true, window, { MCF: { Accordion: Accordion }});
})(jQuery);
