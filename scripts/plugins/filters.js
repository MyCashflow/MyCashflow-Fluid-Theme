/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Filters = {
		init: function () {
			this.bindEvents();
			this.markActiveGroups();
			this.scrollToPosition();
		},

		bindEvents: function () {
			$(document).on('click', '.FilterGroupName', $.proxy(this.onFilterGroupClick, this));
			$(document).on('click', '.ApplyFilter, .RemoveFilter, .ClearFilters a', $.proxy(this.savePosition, this));
			$(document).on('change', '#PaginationSort', $.proxy(this.savePosition, this));
		},

		onFilterGroupClick: function (evt) {
			var $targetGroup = $(evt.currentTarget).parent('.FilterGroup');
			$targetGroup.siblings('.FilterGroup').removeClass('Navigable');
			$targetGroup.toggleClass('Navigable');
			return false;
		},

		savePosition: function () {
			sessionStorage.setItem('category-position', $(window).scrollTop());
		},

		scrollToPosition: function () {
			if (sessionStorage.getItem('category-position')) {
				window.scrollTo({ top: sessionStorage.getItem('category-position'), left: 0, behavior: 'instant' });
				sessionStorage.removeItem('category-position');
			}
		},

		markActiveGroups: function () {
			$('.FilterGroup:has(.RemoveFilter)').addClass('ActiveGroup');
			$('.AccordionFilter:has(.RemoveFilter)').attr('open', true);
			$('.FilterOptions .RemoveFilter').parent().addClass('Selected');
		}
	};

	$.extend(true, window, { MCF: { Filters: Filters }});
})(jQuery);
