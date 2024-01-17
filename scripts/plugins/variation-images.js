/**
 * MyCashflow Default Theme
 * Copyright (c) 2019 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';
	
	var VariationImages = {
		formSelector: '.BuyFormVariationSelect, .BuyFormVariationRadio',
		thumbnails: '[data-images-thumbnails]',

		init: function (config) {
			$.extend(true, this, config);
			this.$form = $(this.formSelector);
			this.bindEvents();
		},

		bindEvents: function () {
			this.$form.on('change', $.proxy(this.onVariationChange, this));
		},

		onVariationChange: function (evt) {
			var $target = $(evt.currentTarget);
			var isRadio = $target.closest('.FormItem').is('.BuyFormVariationRadio');
			var val = '';
			if (isRadio == true) {
				val = $(':checked', $target).val();
			} else {
				val = $(':selected', $target).val();
			}
			this.getImageUrl(val, $target);
		},

		getImageUrl: function (id, $target) {
			var $variation = $('[data-variation-images]').find('[data-variation-id="'+id+'"]');
			var imgUrl = $variation.data('variation-image').split('/')[3];
			this.findThumb(imgUrl, $target);
		},

		findThumb: function (imgUrl, $target) {
			var $product = $target.closest('.Product');
			var $thumb = $(this.thumbnails).find('[src$="/'+imgUrl+'"]').closest('.ProductThumbnail');
			if ($product.length) {
				$thumb = $(this.thumbnails, $product).find('[src$="/'+imgUrl+'"]').closest('.ProductThumbnail');
			}
			this.selectThumb($thumb);
		},

		selectThumb: function ($thumb) {
			var index = $thumb.closest('li').index();
			MCF.ProductImages.jumpToIndex(index, $thumb.closest('.ProductImages'));
		}
	};
	
	$.extend(true, window, { MCF: { VariationImages: VariationImages }});
})(jQuery);
