const singleDigitToWord = [
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

const tenToNineteen = [
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

const twentyToNinety = [
	"",
	"",
	"twenty",
	"thirty",
	"forty",
	"fifty",
	"sixty",
	"seventy",
	"eighty",
	"ninety"
];

const tripletQualifiers = [
	"",
	"thousand",
	"million",
	"billion",
	"trillion",
	"quadrillion"
];

/**
 * Private helper method which converts a two digit string to words.
 * For performance and simplicity this function assumes that the
 * doubleDigitString passed in is in fact two valid numeric characters.
 */
function _doubleDigitToWords(doubleDigitString) {
	let words = "";
	let doubleDigitNumber = Number.parseInt(doubleDigitString);

	if (1 <= doubleDigitNumber && 10 > doubleDigitNumber) {
		words += singleDigitToWord[doubleDigitNumber];
	} else if (10 <= doubleDigitNumber && 20 > doubleDigitNumber) {
		words += tenToNineteen[doubleDigitNumber - 10];
	} else if (20 <= doubleDigitNumber) {
		let decimalDigit = doubleDigitString.charAt(0);
		let singleDigit = doubleDigitString.charAt(1);

		words += twentyToNinety[decimalDigit];

		if (singleDigit !== "0") {
			words += " " + singleDigitToWord[singleDigit];
		}
	}

	return words;
}

/**
 * Private helper method which converts a two digit string to words.
 * For performance and simplicity this function assumes that the
 * tripleDigitString passed in is in fact three valid numeric characters.
 */
function _tripleDigitToWords(tripleDigitString, isPartOfLargerNumber, isLast) {
	let words = "";
	const hundredDigit = tripleDigitString.charAt(0);
	const hundredDigitNumeric = Number.parseInt(hundredDigit);
	const lastTwoDigits = tripleDigitString.substr(1);
	const lastTwoDigitsNumeric = Number.parseInt(lastTwoDigits);

	if (0 < hundredDigitNumeric) {
		words += singleDigitToWord[hundredDigitNumeric] + " hundred";
	}

	const insertAnd = isLast && (isPartOfLargerNumber || (words !== ""));

	if (insertAnd && 0 < lastTwoDigitsNumeric) {
		words += " and";
	}

	words += " " + _doubleDigitToWords(lastTwoDigits);


	return words.trim();
}

export const __TEST_ONLY__ = {
	_doubleDigitToWords: _doubleDigitToWords,
	_tripleDigitToWords: _tripleDigitToWords
};

export function isValidNumber(inputString) {
	return /^-?(([1-9]\d*)|0)$/.test(inputString);
}

export default function numberToWords(inputString) {
	if (!isValidNumber(inputString)) {
		throw Error("Invalid input");
	}

	if (0 === inputString.length) {
		return "";
	}

	let words = "";
	let isNegative = inputString.charAt(0) === "-";
	let unparsedString = isNegative ? inputString.substr(1) : inputString;
	let ordersOfMagnitude =  unparsedString.length;
	let numberOfThreeDigitGroupsLeft = Math.ceil(ordersOfMagnitude / 3);

	while (unparsedString.length > 0) {
		let currentDigitGroupLength = unparsedString.length % 3;
		if (0 === currentDigitGroupLength) {
			currentDigitGroupLength = 3;
		}
		const currentTriplet = unparsedString.substr(0, currentDigitGroupLength - 1);
		const insertAnd = numberOfThreeDigitGroupsLeft === 1;

		words += " " + _tripleDigitToWords(currentTriplet, insertAnd);
		numberOfThreeDigitGroupsLeft -= 1;

		words += " " + tripletQualifiers[numberOfThreeDigitGroupsLeft];

		unparsedString = unparsedString.substr(currentDigitGroupLength);
	}

	return words;
}
