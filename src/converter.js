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

export function getNumberOfTriplets(ordersOfMagnitude) {
	return Math.ceil(ordersOfMagnitude / 3);
}

export function doubleDigitToWords(doubleDigitString) {
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

export function isValidNumber(inputString) {
	return /^-?(([1-9]\d*)|0)$/.test(inputString);
}

export function tripleDigitToWords(tripletString, insertAnd) {
	let words = "";

	if (3 === tripletString.length) {
		let hundredDigit = tripletString.charAt(0);
		let hundredDigitNumeric = Number.parseInt(hundredDigit);

		if (0 < hundredDigitNumeric) {
			words += singleDigitToWord[hundredDigitNumeric] + " hundred";
		}
	}

	if (2 <= tripletString.length) {
		const lastTwoDigits = tripletString.substr(1);
		const lastTwoDigitsNumeric = Number.parseInt(lastTwoDigits);

		if (insertAnd && 0 < lastTwoDigitsNumeric) {
			words += " and";
		}

		words += " " + doubleDigitToWords(lastTwoDigits);
	} else if (1 === tripletString.length) {
		words += singleDigitToWord[tripletString];
	}

	return words.trim();
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
	let numberOfTripletsLeft = getNumberOfTriplets(ordersOfMagnitude);

	while (unparsedString.length > 0) {
		let currentTripletLength = unparsedString.length % 3;
		if (0 === currentTripletLength) {
			currentTripletLength = 3;
		}
		const currentTriplet = unparsedString.substr(0, currentTripletLength - 1);
		const insertAnd = numberOfTripletsLeft === 1;

		words += " " + tripleDigitToWords(currentTriplet, insertAnd);
		numberOfTripletsLeft -= 1;

		words += " " + tripletQualifiers[numberOfTripletsLeft];

		unparsedString = unparsedString.substr(currentTripletLength);
	}

	return words;
}
