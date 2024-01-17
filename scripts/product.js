/**
 * MyCashflow Default Theme
 * Copyright (c) 2023 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
$(document).ready(function () {
	'use strict';

	$.each([
		'QuantityDiscounts',
		'Variations',
		'VariationImages'
	], function (index, name) {
		var plugin = MCF[name];
		if (plugin) {
			plugin.init();
		}
	});

	MCF.ProductImages.init({
		images: '[data-images]',
		thumbnails: '[data-images-thumbnails]',
		wrapAround: true,
		fancybox: true,
		fancyboxSettings: {
			Toolbar: {
				display: [
					"close",
				],
			}
		}
	});

	MCF.VariationsSplitter.init({
		selectText: MCF.dictionary.Choose,
		match: function (firstMatch, selected) {
			selected = selected || firstMatch;
			if (selected) {
				MCF.VariationImages.getImageUrl(selected.input.val(), selected.input);
			}
		}
	});

	//------------------------------------------------------------------------------
	// Misc
	//------------------------------------------------------------------------------

	// Append anchor link ID to product reviews pagination links
	function addAnchorLinkIds() {
		$('#ProductReviews .ReviewsPagination a').each(function () {
			$(this).attr('href', $(this).attr('href') + '#ProductReviews');
		});
	}
	addAnchorLinkIds();

});
