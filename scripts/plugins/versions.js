/**
 * MyCashflow Default Theme
 * Copyright (c) 2021 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';

	var $template = 
		`<details class="DetailsReset" data-details-global-toggle>
			<summary aria-label="${MCF.dictionary.ShowAll}"><div class="Button Button-Small"><span class="fa fa-ellipsis-h-alt"></span></div></summary>
			<nav class="DetailsNavigation"></nav>
		</details>`;
	
	var Versions = {
		truncateNav: '[data-truncate-nav="true"]',
		dynamicLinks: '[data-version-link-pathnames="true"]',

		init: function (config) {
			$.extend(true, this, config);
			this.copyPathNames();
			this.truncate();
		},

		copyPathNames: function () {
			var relativeUrl = window.location.pathname,
			relativeUrl = relativeUrl.substring(1, relativeUrl.length);
			$(this.dynamicLinks).find('.LanguageNavigation a').each(function() {
				$(this).attr('href', function() {
					return this.href + relativeUrl;
				});
			});
		},

		truncate: function () {
			$(this.truncateNav).each(function() {
				var $wrapper = $(this);
				var $nav = $wrapper.find('.InlineNavigation .LanguageNavigation');
				var limit = $wrapper.data('truncate-after') * 1;
				if ($nav.children().length > limit) {
					$wrapper.append($template);
					// $nav.children('.Current').prependTo($nav);
					$nav.clone().prependTo($wrapper.find('nav'));
					$nav.children(':nth-child(n+' + (limit + 1).toString() + ')').hide();
					if ($nav.children('.Current').is('[style="display: none;"]')) {
						$nav.children('.Current').show();
						if ($nav.children('.Current').prevAll(':not([style="display: none;"])').length <= limit) {
							$nav.children('.Current').prevAll(':not([style="display: none;"])').first().hide();
						}
					}
				}
			});
		}
	};
	
	$.extend(true, window, { MCF: { Versions: Versions }});
})(jQuery);
