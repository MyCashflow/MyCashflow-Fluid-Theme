/**
 * MyCashflow Default Theme
 * Copyright (c) 2016 Pulse247 Oy
 * MIT License <http://opensource.org/licenses/MIT>
 */
 ;(function ($) {
	'use strict';

	const Spinners = {
		decimalSeparator: ',',

		ariaLabelInput: window.MCF.dictionary.SpinnerInputQuantity || 'Määrä',
		ariaLabelInc: window.MCF.dictionary.SpinnerButtonInc || 'Lisää määrä',
		ariaLabelDec: window.MCF.dictionary.SpinnerButtonDec || 'Vähennä määrä',

		getIncrTmpl: function () {
			return ['<div class="SpinnerControl">',
				'<button class="SpinnerButton SpinnerButtonInc" type="button" aria-label="' + this.ariaLabelInc + '"></button>',
				'</div>'].join('');
		},

		getDecrTmpl: function () {
			return ['<div class="SpinnerControl">',
				'<button class="SpinnerButton SpinnerButtonDec" type="button" aria-label="' + this.ariaLabelDec + '"></button>',
				'</div>'].join('');
		},

		init: function () {
			this.bindEvents();
			this.wrapInputs($(document.body));
		},

		bindEvents: function () {
			$(document).on('click.spinner', '.SpinnerButton', $.proxy(this.handleClick, this));
			$(document).on('change.spinner', '.SpinnerInput input', $.proxy(this.handleChange, this));
		},

		unbindEvents: function () {
			$(document).off('.spinner');
		},

		wrapInputs: function ($root) {
			$('*:not(.Spinner) [type=number]', $root).each($.proxy(function (index, el) {
				this.wrapInput($(el));
			}, this));
		},

		wrapInput: function ($input) {
			const inputId = $input.attr('id');
			const idAttr = inputId ? ' id="' + inputId + '"' : '';
			let labelText = '';
			if (inputId) {
			  labelText = $('label[for="' + inputId + '"]').text().trim();
			}
			if (!labelText) {
			  labelText = this.ariaLabelInput;
			}
			const ariaLabel = ' aria-label="' + labelText + '"';
			const $newInput = $('<input type="number" inputmode="tel" name="' + $input.attr('name') + '"' + idAttr + ariaLabel + ' />');
			const $spinnerWrapper = $('<div class="Spinner"></div>');
			$spinnerWrapper.attr('role', 'spinbutton').attr('aria-label', labelText);

			const min = $input.attr('min');
			const max = $input.attr('max');
			const step = $input.attr('step');

			if (min) {
			  $spinnerWrapper.attr('aria-valuemin', min);
			  $newInput.data('min', this._parseValue(min));
			}
			if (max) {
			  $spinnerWrapper.attr('aria-valuemax', max);
			  $newInput.data('max', this._parseValue(max));
			}
			if (step) {
			  $newInput.data('step', this._parseValue(step));
			}

			$spinnerWrapper.attr('aria-valuenow', $input.val());
			$input.replaceWith($newInput);
			$newInput
				.val($input.val())
				.wrap($spinnerWrapper)
				.before(this.getDecrTmpl())
				.after(this.getIncrTmpl())
				.wrap($('<div class="SpinnerInput" aria-live="polite"></div>'));

			$newInput.trigger('change.spinner');
		},

		handleChange: function (evt) {
			const $input = $(evt.currentTarget);
			const $spinner = $input.closest('.Spinner');
			const $buttonInc = $spinner.find('button.SpinnerButtonInc');
			const $buttonDec = $spinner.find('button.SpinnerButtonDec');
			let value = this._parseValue($input.val());

			$buttonInc.prop('disabled', value >= $input.data('max'));
			$buttonDec.prop('disabled', value <= $input.data('min'));
			$spinner.attr('aria-valuenow', value);
		},

		handleClick: function (evt) {
			const $input = $(evt.currentTarget).closest('.Spinner').find('input');
			const $spinner = $input.closest('.Spinner');
			const max = $input.data('max') || null;
			const min = $input.data('min') || 0;
			const step = $input.data('step') || 1;
			let value = this._parseValue($input.val() || 0);

			value = $(evt.currentTarget).is('.SpinnerButtonInc') ? value + step : value - step;

			if (min >= 0 && value < min) {
				value = min;
			}
			if (max > 0 && value > max) {
				value = max;
			}

			$spinner.attr('aria-valuemin', min);
			if (max !== null) {
				$spinner.attr('aria-valuemax', max);
			}
			$spinner.attr('aria-valuenow', value);

			$input.val(this._formatValue(value)).trigger('change');
		},

		_formatValue: function (amount) {
			const val = parseFloat(amount);
			return val.toString().replace('.', this.decimalSeparator);
		},

		_parseValue: function (str) {
			const val = parseFloat(str.toString().replace(this.decimalSeparator, '.'));
			return val;
		}
	};

	$.extend(true, window, { MCF: { Spinners: Spinners }});
})(jQuery);
