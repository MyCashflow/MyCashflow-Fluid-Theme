/**
 * MyCashflow Default Theme
 * Copyright (c) 2021 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';

	let prevArrow = `
		<button class="ActionButton ActionButtonPrev" data-images-action="prev">
			<span>{PREV}</span>
		</button>`;

	let nextArrow = `
		<button class="ActionButton ActionButtonNext" data-images-action="next">
			<span>{NEXT}</span>
		</button>`;
	
	const ProductImages = {
		images: '[data-images]',
		thumbnails: '[data-images-thumbnails]',
		caption: '[data-image-caption]',
		wrapAround: true,
		activeClass: 'ActiveImage',
		txtButtonPrev: 'Edellinen',
		txtButtonNext: 'Seuraava',

		fancybox: true,
		fancyboxSettings: {
			groupAll: true,
			groupAttr: '.ProductImage',
			on: {
				"Carousel.ready Carousel.change": (fancybox) => {
					const slide = fancybox.getSlide();
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
				const $activeImage = $(this.images).find('.' + this.activeClass);
				this.change($activeImage);
			});

			const slideObserver = new IntersectionObserver((entries, observer) => {
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
			$(this.images).each($.proxy(function(i, elem) {
				$(elem).addClass('ProductImages-' + i);
				Fancybox.bind('.ProductImages-' + i + ' .ProductImage', this.fancyboxSettings);
			}, this));
		},

		createButtons: function () {
			$(this.images).each(function() {
				const $mainImage = $(this);
				const $imagesContainer = $mainImage.find('.ProductImage').parent();
				const $images = $imagesContainer.children();
				if ($images.length < 2) {
					return false;
				}
				const prev = $mainImage.data('images-text-prev') || this.txtButtonPrev;
				const next = $mainImage.data('images-text-next') || this.txtButtonNext;
				prevArrow = prevArrow.replace('{PREV}', prev);
				nextArrow = nextArrow.replace('{NEXT}', next);
				const $arrows = $('<div class="ProductMainActions"></div>')
					.appendTo($mainImage)
					.append(prevArrow)
					.append(nextArrow);
			});
		},

		createCaptions: function () {
			$(this.images).find('[data-caption]').each(function() {
				const title = $(this).closest('[data-images-product-name]').data('images-product-name');
				const caption = $(this).data('caption');
				if (caption == title) {
					$(this).removeAttr('data-caption');
				}
			});
		},

		onAction: function (evt) {
			const $target = $(evt.currentTarget);
			const $images = $target.closest(this.images).find('.ProductImage').parent();
			const $activeImage = $images.find('.' + this.activeClass);
			const action = $target.data('images-action') || undefined;
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
			const $target = $(evt.currentTarget);
			const $images = $target.closest(this.thumbnails).prev();
			this.change($images.find('.ProductImage[href="' + $target.attr('href') + '"]'), 'auto');
		},

		changeCaption: function (text) {
			const captionSelector = this.caption;
			$(this.images).each(function(i) {
				const $images = $(this);
				const $caption = $images.find(captionSelector);
				if ($caption.length) {
					const currentCaption = $images.find('.ActiveImage').data('caption');
					if (text) {
						$caption.text(text);
						return false;
					}
					$caption.text(currentCaption);
				}
			});
		},

		change: function ($changeTo, behavior) {
			behavior = behavior || 'auto';
			const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			if (isSafari) {
				behavior = 'auto';
			}
			const $images = $changeTo.parent();
			if (!$changeTo.length) {
				return false;
			}
			const position = $changeTo[0].offsetLeft;
			$images[0].scrollTo({left: position, behavior: behavior});
		},

		jumpToIndex: function (index, $instance) {
			const $images = $instance || $(this.images);
			const $targetImg = $images.find('.ProductImage').eq(index);
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
			const $activeImage = $mainImage.find('.' + this.activeClass);
			const $prevArrow = $('[data-images-action="prev"]', $mainImage).prop('disabled', true);
			const $nextArrow = $('[data-images-action="next"]', $mainImage).prop('disabled', true);
			if ($activeImage.next().length) {
				$nextArrow.prop('disabled', false);
			}
			if ($activeImage.prev().length) {
				$prevArrow.prop('disabled', false);
			}
		},

		refreshThumbs: function ($mainImage) {
			const $activeImage = $mainImage.find('.' + this.activeClass);
			const $thumbs = $mainImage.next(this.thumbnails);
			const $activeThumb = $thumbs.find('.ProductThumbnail[href="' + $activeImage.attr('href') + '"]');
			if ($activeThumb.length) {
				$activeThumb.parent().addClass('ActiveThumb').siblings().removeClass('ActiveThumb');
			}
		}
	};
	
	$.extend(true, window, { MCF: { ProductImages: ProductImages }});
})(jQuery);
