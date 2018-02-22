const SINGLE_DIGITS = [
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
];

const TEN_TO_NINETEEN = [
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen"
];

const TWENTY_TO_NINETY = [
	"twenty",
	"thirty",
	"forty",
	"fifty",
	"sixty",
	"seventy",
	"eighty",
	"ninety"
];

const PERIOD_NAMES = [
	"",
	"thousand",
	"million",
	"billion",
	"trillion",
	"quadrillion",
	"quintillion",
	"sextillion",
	"septillion",
	"octillion",
	"nonillion",
	"decillion",
	"undecillion",
	"duodecillion",
	"tredecillion",
	"quattuordecillion",
	"quindecillion",
	"sexdecillion",
	"septendecillion",
	"octodecillion",
	"novemdecillion",
	"vigintillion",
];

const MAX_NUM_DIGITS = PERIOD_NAMES.length * 3;

/**
 * Private helper method which converts a two digit string to words.
 * For performance and simplicity this function assumes that the
 * doubleDigitString passed in is in fact two valid numeric characters.
 */
function _doubleDigitToWords(doubleDigitString) {
	let words = "";
	let doubleDigitNumber = Number.parseInt(doubleDigitString);

	if (1 <= doubleDigitNumber && 10 > doubleDigitNumber) {
		words += SINGLE_DIGITS[doubleDigitNumber];
	} else if (10 <= doubleDigitNumber && 20 > doubleDigitNumber) {
		words += TEN_TO_NINETEEN[doubleDigitNumber - 10];
	} else if (20 <= doubleDigitNumber) {
		let decimalDigit = Number.parseInt(doubleDigitString.charAt(0));
		let singleDigit = Number.parseInt(doubleDigitString.charAt(1));

		words += TWENTY_TO_NINETY[decimalDigit - 2];

		if (0 < singleDigit) {
			words += " " + SINGLE_DIGITS[singleDigit];
		}
	}

	return words;
}

/**
 * Private helper method which converts a two digit string to words.
 * For performance and simplicity this function assumes that the
 * tripleDigitString passed in is in fact three valid numeric characters.
 */
function _tripleDigitToWords(tripleDigitString, isPartOfLargerNumber, isFirst) {
	let words = "";
	const hundredDigit = tripleDigitString.charAt(0);
	const hundredDigitNumeric = Number.parseInt(hundredDigit);
	const lastTwoDigits = tripleDigitString.substr(1);
	const lastTwoDigitsNumeric = Number.parseInt(lastTwoDigits);

	if (0 < hundredDigitNumeric) {
		words += SINGLE_DIGITS[hundredDigitNumeric] + " hundred";
	}

	const insertAnd = isFirst && (isPartOfLargerNumber || (words !== ""));

	if (insertAnd && 0 < lastTwoDigitsNumeric) {
		words += " and";
	}

	words += " " + _doubleDigitToWords(lastTwoDigits);

	return words.trim();
}


function isValidInteger(inputString) {
	return /^((-?([1-9]\d*))|0)$/.test(inputString);
}

const ERROR_INVALID_INTEGER = "The input is not a valid integer.";
const ERROR_MAX_LENGTH_EXCEEDED = "The number of digits exceeds the maximum supported length of " + MAX_NUM_DIGITS + ".";

function integerToWords(inputString) {
	if (0 === inputString.length) {
		return "";
	}

	if (!isValidInteger(inputString)) {
		throw Error(ERROR_INVALID_INTEGER);
	}

	let words = "";
	let isNegative = inputString.charAt(0) === "-";
	let unparsedString = isNegative ? inputString.substr(1) : inputString;
	let currentPeriodIndex = 0;
	let currentDigitGroup = unparsedString.substring(unparsedString.length - 3);

	if (MAX_NUM_DIGITS < unparsedString.length) {
		throw Error(ERROR_MAX_LENGTH_EXCEEDED);
	}

	while (0 < currentDigitGroup.length) {
		let currentDigitGroupConverted = "";
		const isPartOfLargerNumber = 0 < unparsedString.length - 3;

		if (0 < currentPeriodIndex && 0 < words.length && " " !== words.charAt(0)) {
			words = " " + words;
		}

		switch (currentDigitGroup.length) {
			case 1:
				currentDigitGroupConverted = SINGLE_DIGITS[currentDigitGroup];
				break;
			case 2:
				currentDigitGroupConverted = _doubleDigitToWords(currentDigitGroup);
				break;
			case 3:
				currentDigitGroupConverted = _tripleDigitToWords(currentDigitGroup, isPartOfLargerNumber, 0 === currentPeriodIndex);
				break;
			default:
				// should not be reachable
				throw Error("unexpected parse error, currentDigitGroup.length = " + currentDigitGroup.length);
		}

		if (0 < currentDigitGroupConverted.length) {
			const periodString = (0 < currentPeriodIndex) ? " " + PERIOD_NAMES[currentPeriodIndex] : "";
			words = currentDigitGroupConverted + periodString + words;
		}

		unparsedString = unparsedString.substring(0, unparsedString.length - 3);
		currentDigitGroup = unparsedString.substring(unparsedString.length - 3);
		currentPeriodIndex++;
	}

	if (isNegative) {
		words = "Negative " + words;
	}

	return words.charAt(0).toUpperCase() + words.substring(1);
}

export default {
	MAX_NUM_DIGITS: MAX_NUM_DIGITS,
	isValidInteger: isValidInteger,
	integerToWords: integerToWords,
	__TEST_ONLY__: {
		_doubleDigitToWords: _doubleDigitToWords,
		_tripleDigitToWords: _tripleDigitToWords,
		ERROR_INVALID_INTEGER: ERROR_INVALID_INTEGER,
		ERROR_MAX_LENGTH_EXCEEDED: ERROR_MAX_LENGTH_EXCEEDED
	}
};
