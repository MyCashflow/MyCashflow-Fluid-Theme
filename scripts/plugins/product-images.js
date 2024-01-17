/**
 * MyCashflow Default Theme
 * Copyright (c) 2021 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';

	var prevArrow = `
		<button class="ActionButton ActionButtonPrev" data-images-action="prev">
			<span>{PREV}</span>
		</button>`;

	var nextArrow = `
		<button class="ActionButton ActionButtonNext" data-images-action="next">
			<span>{NEXT}</span>
		</button>`;
	
	var ProductImages = {
		images: '[data-images]',
		thumbnails: '[data-images-thumbnails]',
		caption: '[data-image-caption]',
		wrapAround: true,
		activeClass: 'ActiveImage',
		txtButtonPrev: 'Edellinen',
		txtButtonNext: 'Seuraava',

		fancybox: true,
		fancyboxSettings: {
			groupAll : true,
			l10n: MCF.Modals.fancyboxDefaults.l10n,
			Toolbar: {
				display: [
					// { id: "prev", position: "center" },
					// { id: "counter", position: "center" },
					// { id: "next", position: "center" },
					// "zoom",
					// "slideshow",
					// "fullscreen",
					// "download",
					// "thumbs",
					"close",
				],
			},
			on: {
				"Carousel.selectSlide": (fancybox, carousel, slide) => {
					MCF.ProductImages.jumpToIndex(slide.index);
				}
			}
		},

		init: function (config) {
			$.extend(true, this, config);
			this.bindEvents();
			this.createButtons();
			this.createCaptions();
			if (this.fancybox == true) {
				this.initFancybox();
			}
		},

		bindEvents: function () {
			$(document).on('click', '[data-images-action]', $.proxy(this.onAction, this));
			$(document).on('click', '.ProductThumbnail', $.proxy(this.onThumbnailClick, this));

			window.addEventListener('resize', () => {
				var $activeImage = $(this.images).find('.' + this.activeClass);
				this.change($activeImage);
			});

			var slideObserver = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
							$(entry.target).addClass(this.activeClass).removeAttr('aria-hidden').siblings().removeClass(this.activeClass).attr('aria-hidden', 'true');
							this.refresh($(entry.target).closest(this.images));
							this.changeCaption();
					}
				});
			}, { threshold: .1 });

			$(this.images).each(function() {
				$(this).find('.ProductMainImageContainer').children().each(function() {
					slideObserver.observe(this);
				});
			});
		},

		initFancybox: function () {
			$(this.images).each(function(i) {
				$(this).addClass('ProductImages-' + i);
				Fancybox.bind('.ProductImages-' + i + ' .ProductImage', MCF.ProductImages.fancyboxSettings);
			});
		},

		createButtons: function () {
			$(this.images).each(function() {
				var $mainImage = $(this);
				var $imagesContainer = $mainImage.find('.ProductImage').parent();
				var $images = $imagesContainer.children();
				if ($images.length < 2) {
					return false;
				}
				var prev = $mainImage.data('images-text-prev') || this.txtButtonPrev;
				var next = $mainImage.data('images-text-next') || this.txtButtonNext;
				prevArrow = prevArrow.replace('{PREV}', prev);
				nextArrow = nextArrow.replace('{NEXT}', next);
				var $arrows = $('<div class="ProductMainActions"></div>')
					.appendTo($mainImage)
					.append(prevArrow)
					.append(nextArrow);
			});
		},

		createCaptions: function () {
			$(this.images).find('[data-caption]').each(function() {
				var title = $(this).closest('[data-images-product-name]').data('images-product-name');
				var caption = $(this).data('caption');
				if (caption == title) {
					$(this).removeAttr('data-caption');
				}
			});
		},

		onAction: function (evt) {
			var $target = $(evt.currentTarget);
			var $images = $target.closest(this.images).find('.ProductImage').parent();
			var $activeImage = $images.find('.' + this.activeClass);
			var action = $target.data('images-action') || undefined;
			if (action == 'next') {
				if ($activeImage.next().length) {
					this.change($activeImage.next(), 'smooth');
				} else if (this.wrapAround == true) {
					this.change($images.children().first(), 'smooth');
				}
			}
			if (action == 'prev') {
				if ($activeImage.prev().length) {
					this.change($activeImage.prev(), 'smooth');
				} else if (this.wrapAround == true) {
					this.change($images.children().last(), 'smooth');
				}
			}
		},

		onThumbnailClick: function (evt) {
			evt.preventDefault();
			var $target = $(evt.currentTarget);
			var $images = $target.closest(this.thumbnails).prev();
			this.change($images.find('.ProductImage[href="' + $target.attr('href') + '"]'), 'auto');
		},

		changeCaption: function (text) {
			var captionSelector = this.caption;
			$(this.images).each(function(i) {
				var $images = $(this);
				var $caption = $images.find(captionSelector);
				if ($caption.length) {
					var currentCaption = $images.find('.ActiveImage').data('caption');
					if (text) {
						$caption.text(text);
						return false;
					}
					$caption.text(currentCaption);
				}
			});
		},

		change: function ($changeTo, behavior) {
			var behavior = behavior || 'auto';
			var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			if (isSafari) {
				behavior = 'auto';
			}
			var $images = $changeTo.parent();
			if (!$changeTo.length) {
				return false;
			}
			var position = $changeTo[0].offsetLeft;
			$images[0].scrollTo({left: position, behavior: behavior});
		},

		jumpToIndex: function (index, $instance) {
			var $images = $instance || $(this.images);
			var $targetImg = $images.find('.ProductImage').eq(index);
			this.change($targetImg);
		},

		refresh: function ($mainImage) {
			this.refreshThumbs($mainImage);
			if (this.wrapAround == true) {
				return false;
			}
			this.refreshButtons($mainImage);
		},

		refreshButtons: function ($mainImage) {
			var $activeImage = $mainImage.find('.' + this.activeClass);
			var $prevArrow = $('[data-images-action="prev"]', $mainImage).prop('disabled', true);
			var $nextArrow = $('[data-images-action="next"]', $mainImage).prop('disabled', true);
			if ($activeImage.next().length) {
				$nextArrow.prop('disabled', false);
			}
			if ($activeImage.prev().length) {
				$prevArrow.prop('disabled', false);
			}
		},

		refreshThumbs: function ($mainImage) {
			var $activeImage = $mainImage.find('.' + this.activeClass);
			var $thumbs = $mainImage.next(this.thumbnails);
			var $activeThumb = $thumbs.find('.ProductThumbnail[href="' + $activeImage.attr('href') + '"]');
			if ($activeThumb.length) {
				$activeThumb.parent().addClass('ActiveThumb').siblings().removeClass('ActiveThumb');
			}
		}
	};
	
	$.extend(true, window, { MCF: { ProductImages: ProductImages }});
})(jQuery);
