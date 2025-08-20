/**
 * MyCashflow Default Theme
 * Copyright (c) 2022 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
;(function ($) {
	'use strict';

	var Sliders = {
		slider: '[data-slider]',
		activeClass: 'IsVisible',
		autoplayDelay: 4000,

		init: function (config) {
			$.extend(true, this, config);
			this.bindEvents();
			this.onSliderObserve();
			this.onSliderScroll();
			this.onWindowResize();
			this.addPositionElements();
		},

		bindEvents: function () {
			$(document).on('click', '[data-slider-action]', $.proxy(this.onSliderActionClick, this));
			$(document).on('click', '[data-slider-position] > span', $.proxy(this.onSliderPositionClick, this));
			$(document).on('mouseover', '[data-autoplay]', $.proxy(this.onSliderMouseOver, this));
			$(document).on('mouseleave', '[data-autoplay]', $.proxy(this.onSliderMouseLeave, this));
			$(document).on('touchmove', '[data-autoplay]', $.proxy(this.onSliderTouchMove, this));
		},

		onSliderMouseOver: function (evt) {
			const $slider = $(evt.currentTarget).closest(this.slider);
			if ($slider.data('intervalId')) {
				this.stopAutoplay($slider);
			}
		},

		onSliderMouseLeave: function (evt) {
			this.autoplay($(evt.currentTarget).closest(this.slider));
		},

		onSliderTouchMove: function (evt) {
			this.disableAutoplay($(evt.currentTarget).closest(this.slider));
		},

		onSliderObserve: function () {
			const slideObserver = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
							$(entry.target).addClass(this.activeClass).attr('aria-current', true);
							this.refresh($(entry.target).closest(this.slider));
					} else {
						$(entry.target).removeClass(this.activeClass).attr('aria-current', false);
					}
				});
			}, { threshold: .1 });

			$(this.slider).each(function() {
				$(this).find('[data-slider-viewport]').children().each(function() {
					slideObserver.observe(this);
				});
				MCF.Sliders.initSettings($(this));
			});
		},

		initSettings: function ($slider) {
			this.autoplay($slider);
		},

		onSliderScroll: function () {
			$(this.slider).find('[data-slider-viewport]').each(function() {
				const $slider = $(this).closest(MCF.Sliders.slider);

				const onScrollStop = callback => {
					let isScrolling;
					$(this)[0].addEventListener(
						'scroll',
						e => {
							clearTimeout(isScrolling);
							isScrolling = setTimeout(() => {
								callback();
							}, 20);
						},
						false
					);
				};

				onScrollStop(() => {
					MCF.Sliders.refresh($slider);
				});
			});
		},

		onWindowResize: function () {
			addEventListener('resize', (event) => {
				$(this.slider).each(function() {
					MCF.Sliders.refresh($(this));
				});
			});
		},

		onSliderActionClick: function (evt) {
			const $target = $(evt.currentTarget);
			const $slides = $target.closest(this.slider).find('[data-slider-viewport]');
			const $lastVisible = $slides.find('.' + this.activeClass).last();
			const $prevHidden = $slides.find('.' + this.activeClass).first().prevAll();
			let slidesInViewportCount = $slides.children('.' + this.activeClass).length - 1;
			let action = $target.data('slider-action') || undefined;
			if (action == 'next') {
				if ($lastVisible.next().length) {
					this.change($lastVisible.next(), 'smooth');
				} else {
					this.change($slides.children().last(), 'smooth');
				}
			}
			if (action == 'prev') {
				if ($prevHidden[slidesInViewportCount]) {
					this.change($($prevHidden[slidesInViewportCount]), 'smooth');
				} else if ($prevHidden.length) {
					this.change($prevHidden.last(), 'smooth');
				} else {
					this.change($slides.children().first(), 'smooth');
				}
			}
			this.disableAutoplay($target.closest(this.slider));
		},

		onSliderPositionClick: function (evt) {
			this.jumpToIndex($(evt.currentTarget).index());
			this.disableAutoplay($(evt.currentTarget).closest(this.slider));
		},
		
		autoplay: function ($slider, delay) {
			let autoplay = $slider.data('autoplay');
			delay = delay || autoplay || this.autoplayDelay;
			if (delay < 1000) {
				delay = this.autoplayDelay;
			}
			if (autoplay) {
				if ($slider.data('intervalId')) {
					this.stopAutoplay($slider);
				}
				const intervalId = setInterval(() => {
					this.runAutoplay($slider);
				}, delay);
				$slider.data('interval-id', intervalId);
			}
		},

		runAutoplay: function ($slider) {
			const $slides = $slider.find('[data-slider-viewport]');
			const $lastVisible = $slides.find('.' + this.activeClass).last();
			const firstSlidePos = $slides.children().first()[0].getBoundingClientRect();
			const lastSlidePos = $slides.children().last()[0].getBoundingClientRect();
			const sliderPos = $slider[0].getBoundingClientRect();
			let transition = 'smooth';
			if (lastSlidePos.right <= sliderPos.right && sliderPos.left == firstSlidePos.left) {
				this.disableAutoplay($slider);
				return;
			}
			if ($lastVisible.is(':last-child') && $slides.children().length == 2) {
				if (firstSlidePos.left < sliderPos.left) {
					this.change($slides.children().first(), transition);
				} else {
					this.change($lastVisible, transition);
				}
			} else if ($lastVisible.next().is(':last-child') && $slides.children().length > 3) {
				this.change($lastVisible.next(), transition);
			} else if (!$lastVisible.next().length) {
				this.change($slides.children().first(), transition);
			} else {
				this.change($slides.find('.' + this.activeClass).first().next(), transition);
			}
		},

		stopAutoplay: function ($slider) {
			const intervalId = $slider.data('intervalId');
			if (intervalId) {
				clearInterval(intervalId);
				$slider.data('intervalId', '');
			}
		},

		disableAutoplay: function ($slider) {
			this.stopAutoplay($slider);
			$slider.data('autoplay', '');
		},

		change: function ($changeTo, behavior) {
			behavior = behavior || 'auto';
			const $slides = $changeTo.parent();
			if (!$changeTo.length) {
				return false;
			}
			let position = $changeTo[0].offsetLeft;
			$slides[0].scrollTo({left: position, behavior: behavior});
		},

		jumpToIndex: function (index) {
			const $targetSlide = $(this.slider).find('[data-slider-viewport]').children().eq(index);
			this.change($targetSlide);
		},

		refresh: function ($slider) {
			this.refreshButtons($slider);
			this.refreshPosition($slider);
		},

		addPositionElements: function () {
			var $slider = $('[data-slider]');
			$slider.each(function () {
				var count = $(this).find('[data-slider-viewport]').children().length;
				var $position = $(this).find('[data-slider-position]');
				if (!$position.length || count < 2) {
					return false;
				}
				if (!$position.children().length) {
					$position.append(new Array(++count).join('<span></span>'));
				}
			});
		},

		refreshButtons: function ($slider) {
			const $slides = $slider.find('[data-slider-viewport]');
			let $prevArrow = $('[data-slider-action="prev"]', $slider).prop('disabled', true);
			let $nextArrow = $('[data-slider-action="next"]', $slider).prop('disabled', true);

			let sliderPos = $slides[0].getBoundingClientRect();
			let firstSlidePos = $slides.children().first()[0].getBoundingClientRect();
			let lastSlidePos = $slides.children().last()[0].getBoundingClientRect();

			if ((lastSlidePos.right - 1) > sliderPos.right) {
				$nextArrow.prop('disabled', false);
			}
			if ((firstSlidePos.left + 1) < sliderPos.left) {
				$prevArrow.prop('disabled', false);
			}
		},

		refreshPosition: function ($slider) {
			var $position = $slider.find('[data-slider-position]');
			if (!$position.length || $slider.find('[data-slider-viewport]').children().length < 2) {
				return false;
			}
			$slider.find('[data-slider-position] .IsVisible').removeClass('IsVisible');
			$slider.find('[data-slider-viewport] .IsVisible').each(function (i) {
				var index = $(this).index();
				$position.children().eq(index).addClass('IsVisible');
			});
		}
	};
	
	$.extend(true, window, { MCF: { Sliders: Sliders }});
})(jQuery);
