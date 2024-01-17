/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Navigations = {
		navigations: '[data-navigation-expandable]',
		expandables: '[class*="HasSub"]',
		showAll: false,
		addActive: false,

		init: function () {
			if (this.addActive) {
				this.addActiveClasses($(this.navigations));
			}
			this.addExpanders(this.navigations);
			this.expandCurrent(this.navigations);
			this.bindEvents();
			if (this.showAll) {
				this.addShowAll(this.navigations);
			}
		},

		bindEvents: function () {
			$(document).on('click', '.NavigationExpander:not([tabindex="-1"])', this.expand);
			$(document).on('click', '.ToggleOpen', this.onToggleCategory);
			$(document).on('click', '[data-subnavigation-loader] .NavigationExpander', $.proxy(this.onExpanderClick, this));
		},

		addExpanders: function (navSelectors) {
			$(this.expandables, navSelectors).find('> a').each($.proxy(function (index, el) {
				this.addExpander($(el));
			}, this));
		},

		addExpander: function ($navItem) {
			var toggleHtml = '<button class="NavigationExpander" tabindex="0"></button>';
			$navItem.append(toggleHtml);
		},

		expand: function (evt) {
			evt.preventDefault();
			var $expander = $(evt.target);
			$expander.add($expander.closest('[class*="HasSub"]')).toggleClass('Open');
		},

		expandCurrent: function (navSelectors) {
			var $navItems = $('.Current[class*="HasSub"]', navSelectors);
			$navItems.add($navItems.find('> a > .NavigationExpander')).addClass('Open');
		},

		addShowAll: function (navSelectors) {
			if (!this.showAll) {
				return false;
			}
			$(navSelectors).children('.Categories').find('[class*="HasSub"]').each(function () {
				var $this = $(this);
				var url = $this.children('a').attr('href');
				var $showAll = $('<li />')
					.addClass('ShowAllLink');
				var $showAllLink = $('<a />')
					.text(MCF.dictionary.ShowAll)
					.attr('href', url)
					.prependTo($showAll);
				$showAll.prependTo($(this).find('ul').first());
				$this.children('a').addClass('ToggleOpen').children('.NavigationExpander').attr('tabindex', '-1');
			});
		},

		onToggleCategory: function (evt) {
			evt.preventDefault();
			var $expander = $(evt.target).closest('[class*="HasSub"]');
			$expander.toggleClass('Open').find('> a > .NavigationExpander').toggleClass('Open');
		},

		addActiveClasses: function ($navigation) {
			var $navigation = $navigation || $(this.navigations);
			var currentId = this.getCurrentId();
			if (currentId) {
				$navigation.find('.' + currentId[1] + 'ID-' + currentId[0]).last().addClass('Current').parents('li').addClass('Current');
			}
		},

		getCurrentId: function () {
			var classes = $('body').attr('class').split(/\s+/);
			var currentId = undefined;
			var type = undefined;
			$.each(classes, function(index, item) {
				if (item.match("^CategoryID-")) {
					currentId = item.split('-')[1];
					type = 'Category';
				}
				if (item.match("^CampaignID-")) {
					currentId = item.split('-')[1];
					type = 'Campaign';
				}
				if (item.match("^BrandID-")) {
					currentId = item.split('-')[1];
					type = 'Brand';
				}
				if (item.match("^InfoPageID-")) {
					currentId = item.split('-')[1];
					type = 'InfoPage';
				}
			});
			return [currentId, type];
		},

		onExpanderClick: function (evt) {
			var $categoryLink = $(evt.currentTarget).closest('a');
			if ($categoryLink.next('ul').length) {
				return false;
			}
			this.loadSubCategories($categoryLink);
		},

		loadSubCategories: function ($categoryLink) {
			var categoryId = $categoryLink.attr('href').split('/')[2];
			var url = '/interface/categories?parent=' + categoryId;
			MCF.Loaders.show($categoryLink);
			$.get(url)
			.then(function (html) {
				$(html).insertAfter($categoryLink);
				MCF.Navigations.addExpanders('a[href*="/category/' + categoryId + '/"] + ul');
				MCF.Loaders.hide($categoryLink);
			});
		}
	};

	$.extend(true, window, { MCF: { Navigations: Navigations }});
})(jQuery);
