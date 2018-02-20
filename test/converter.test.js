import {assert} from "chai";
import numberToWords, {
	isValidNumber,
	__TEST_ONLY__
} from "../src/converter";

const _doubleDigitToWords = __TEST_ONLY__._doubleDigitToWords;
const _tripleDigitToWords = __TEST_ONLY__._tripleDigitToWords;

describe("converter", function() {

	describe("_doubleDigitToWords", function() {
		it("returns the correct words for valid input", function() {
			assert.equal(_doubleDigitToWords("00"), "");
			assert.equal(_doubleDigitToWords("01"), "one");
			assert.equal(_doubleDigitToWords("08"), "eight");
			assert.equal(_doubleDigitToWords("10"), "ten");
			assert.equal(_doubleDigitToWords("19"), "nineteen");
			assert.equal(_doubleDigitToWords("20"), "twenty");
			assert.equal(_doubleDigitToWords("42"), "forty two");
			assert.equal(_doubleDigitToWords("89"), "eighty nine");
			assert.equal(_doubleDigitToWords("90"), "ninety");
			assert.equal(_doubleDigitToWords("99"), "ninety nine");
		});
	});

	describe("_tripleDigitToWords", function() {
		context ("is not part of a larger number", function() {
			it("returns the correct words for valid input", function() {
				assert.equal(_tripleDigitToWords("000", false, true), "");
				assert.equal(_tripleDigitToWords("001", false, true), "one");
				assert.equal(_tripleDigitToWords("008", false, true), "eight");
				assert.equal(_tripleDigitToWords("010", false, true), "ten");
				assert.equal(_tripleDigitToWords("019", false, true), "nineteen");
				assert.equal(_tripleDigitToWords("020", false, true), "twenty");
				assert.equal(_tripleDigitToWords("042", false, true), "forty two");
				assert.equal(_tripleDigitToWords("089", false, true), "eighty nine");
				assert.equal(_tripleDigitToWords("101", false, true), "one hundred and one");
				assert.equal(_tripleDigitToWords("900", false, true), "nine hundred");
				assert.equal(_tripleDigitToWords("978", false, true), "nine hundred and seventy eight");
			});
		});

		context ("is last part of a larger number", function() {
			it("adds 'and' at the appropriate places", function() {
				assert.equal(_tripleDigitToWords("000", true, true), "");
				assert.equal(_tripleDigitToWords("001", true, true), "and one");
				assert.equal(_tripleDigitToWords("008", true, true), "and eight");
				assert.equal(_tripleDigitToWords("010", true, true), "and ten");
				assert.equal(_tripleDigitToWords("019", true, true), "and nineteen");
				assert.equal(_tripleDigitToWords("020", true, true), "and twenty");
				assert.equal(_tripleDigitToWords("042", true, true), "and forty two");
				assert.equal(_tripleDigitToWords("089", true, true), "and eighty nine");
				assert.equal(_tripleDigitToWords("101", true, true), "one hundred and one");
				assert.equal(_tripleDigitToWords("900", true, true), "nine hundred");
				assert.equal(_tripleDigitToWords("978", true, true), "nine hundred and seventy eight");
			});
		});

		context ("is part of a larger number but not last", function() {
			it("does not add 'and' in any location", function() {
				assert.equal(_tripleDigitToWords("000", true, false), "");
				assert.equal(_tripleDigitToWords("001", true, false), "one");
				assert.equal(_tripleDigitToWords("008", true, false), "eight");
				assert.equal(_tripleDigitToWords("010", true, false), "ten");
				assert.equal(_tripleDigitToWords("019", true, false), "nineteen");
				assert.equal(_tripleDigitToWords("020", true, false), "twenty");
				assert.equal(_tripleDigitToWords("042", true, false), "forty two");
				assert.equal(_tripleDigitToWords("101", true, false), "one hundred one");
				assert.equal(_tripleDigitToWords("089", true, false), "eighty nine");
				assert.equal(_tripleDigitToWords("900", true, false), "nine hundred");
				assert.equal(_tripleDigitToWords("978", true, false), "nine hundred seventy eight");
			});
		});
	});

	describe("isValidNumber", function() {
		it("returns true for valid positive integers", function() {
			assert.isTrue(isValidNumber("0"));
			assert.isTrue(isValidNumber("1"));
			assert.isTrue(isValidNumber("9"));
			assert.isTrue(isValidNumber("11"));
			assert.isTrue(isValidNumber("1234567890"));
			assert.isTrue(isValidNumber("1234567890123456789012345678901234567890"));
		});

		it("returns true for valid negative integers", function() {
			assert.isTrue(isValidNumber("-1"));
			assert.isTrue(isValidNumber("-11"));
			assert.isTrue(isValidNumber("-9"));
			assert.isTrue(isValidNumber("-9999999"));
		});

		it("returns false for numbers with delimiters", function() {
			assert.isFalse(isValidNumber("1,000"));
			assert.isFalse(isValidNumber("9,999,999"));
		});

		it("returns false for numbers with decimal points", function() {
			assert.isFalse(isValidNumber("0.1"));
			assert.isFalse(isValidNumber("1.1"));
		});

		it("returns false for numbers that start with 0", function() {
			assert.isFalse(isValidNumber("01"));
			assert.isFalse(isValidNumber("000001"));
		});

		it("returns false for input string with non numeric characters", function() {
			assert.isFalse(isValidNumber("b2"));
			assert.isFalse(isValidNumber("1a1"));
			assert.isFalse(isValidNumber("123c"));
			assert.isFalse(isValidNumber("100 1"));
			assert.isFalse(isValidNumber("$100"));
		});
	});

	describe("numberToWords", function() {
		context("invalid input", function() {
			it("throws an exception for invalid input", function() {
				assert.throws(numberToWords.bind(this, "1.1"));
				assert.throws(numberToWords.bind(this, "$1"));
				assert.throws(numberToWords.bind(this, "1,000"));
				assert.throws(numberToWords.bind(this, "012"));
			});
		});

		context("valid input", function() {
			it("properly converts single digits", function() {
				assert.equal(numberToWords("0"), "Zero");
				assert.equal(numberToWords("1"), "One");
				assert.equal(numberToWords("-1"), "Minus one");
				assert.equal(numberToWords("2"), "Two");
				assert.equal(numberToWords("-2"), "Minus two");
				assert.equal(numberToWords("9"), "Nine");
				assert.equal(numberToWords("-9"), "Minus nine");
			});

			it("properly converts double digits", function() {
				assert.equal(numberToWords("10"), "Ten");
				assert.equal(numberToWords("-10"), "Minus ten");
				assert.equal(numberToWords("11"), "Eleven");
				assert.equal(numberToWords("-11"), "Minus eleven");
				assert.equal(numberToWords("15"), "Fifteen");
				assert.equal(numberToWords("-15"), "Minus fifteen");
			});

			it("properly converts triple digits", function() {
				assert.equal(numberToWords("100"), "One hundred");
				assert.equal(numberToWords("-100"), "Minus one hundred");
				assert.equal(numberToWords("111"), "One hundred and eleven");
				assert.equal(numberToWords("-111"), "Minus one hundred and eleven");
				assert.equal(numberToWords("600"), "Six hundred");
				assert.equal(numberToWords("-600"), "Minus six hundred");
				assert.equal(numberToWords("901"), "Nine hundred and one");
				assert.equal(numberToWords("987"), "Nine hundred and eighty seven");
				assert.equal(numberToWords("999"), "Nine hundred and ninety nine");
			});

			it("properly converts thousands", function() {
				assert.equal(numberToWords("1000"), "One thousand");
				assert.equal(numberToWords("1100"), "One thousand one hundred");
				assert.equal(numberToWords("1101"), "One thousand one hundred and one");
				assert.equal(numberToWords("1111"), "One thousand one hundred and eleven");
				assert.equal(numberToWords("2222"), "Two thousand two hundred and twenty two");
				assert.equal(numberToWords("-1000"), "Minus one thousand");
				assert.equal(numberToWords("-2222"), "Minus two thousand two hundred and twenty two");
				assert.equal(numberToWords("10000"), "Ten thousand");
				assert.equal(numberToWords("10208"), "Ten thousand two hundred and eight");
				assert.equal(numberToWords("100208"), "One hundred thousand two hundred and eight");
				assert.equal(numberToWords("101101"), "One hundred one thousand one hundred and one");
			});

			it("properly converts millions and above", function() {
				assert.equal(numberToWords("1000000"), "One million");
				assert.equal(numberToWords("1101101"), "One million one hundred one thousand one hundred and one");
				assert.equal(numberToWords("9000000000"), "Nine billion");
				assert.equal(numberToWords("9000000000000"), "Nine trillion");
				assert.equal(numberToWords("9000000000000000"), "Nine quadrillion");
				assert.equal(numberToWords("9000000000001000"), "Nine quadrillion one thousand");
				assert.equal(numberToWords("9000000000000000000000000283000"), "Nine nonillion two hundred eighty three thousand");
				assert.equal(numberToWords("9000000000000000000000000000000000000000000000000000000001000001"), "Nine vigintillion one million and one");
				assert.equal(numberToWords("999000000000000000000000000000000000000000000000000000000001000001"), "Nine hundred ninety nine vigintillion one million and one");
				assert.equal(
					numberToWords("999999999999999999999999999999999999999999999999999999999999999999"),
					"Nine hundred ninety nine vigintillion" +
					" nine hundred ninety nine novemdecillion" +
					" nine hundred ninety nine octodecillion" +
					" nine hundred ninety nine septendecillion" +
					" nine hundred ninety nine sexdecillion" +
					" nine hundred ninety nine quindecillion" +
					" nine hundred ninety nine quattuordecillion" +
					" nine hundred ninety nine tredecillion" +
					" nine hundred ninety nine duodecillion" +
					" nine hundred ninety nine undecillion" +
					" nine hundred ninety nine decillion" +
					" nine hundred ninety nine nonillion" +
					" nine hundred ninety nine octillion" +
					" nine hundred ninety nine septillion" +
					" nine hundred ninety nine sextillion" +
					" nine hundred ninety nine quintillion" +
					" nine hundred ninety nine quadrillion" +
					" nine hundred ninety nine trillion" +
					" nine hundred ninety nine billion" +
					" nine hundred ninety nine million" +
					" nine hundred ninety nine thousand" +
					" nine hundred and ninety nine"
				);
				assert.equal(
					numberToWords("-999999999999999999999999999999999999999999999999999999999999999999"),
					"Minus nine hundred ninety nine vigintillion" +
					" nine hundred ninety nine novemdecillion" +
					" nine hundred ninety nine octodecillion" +
					" nine hundred ninety nine septendecillion" +
					" nine hundred ninety nine sexdecillion" +
					" nine hundred ninety nine quindecillion" +
					" nine hundred ninety nine quattuordecillion" +
					" nine hundred ninety nine tredecillion" +
					" nine hundred ninety nine duodecillion" +
					" nine hundred ninety nine undecillion" +
					" nine hundred ninety nine decillion" +
					" nine hundred ninety nine nonillion" +
					" nine hundred ninety nine octillion" +
					" nine hundred ninety nine septillion" +
					" nine hundred ninety nine sextillion" +
					" nine hundred ninety nine quintillion" +
					" nine hundred ninety nine quadrillion" +
					" nine hundred ninety nine trillion" +
					" nine hundred ninety nine billion" +
					" nine hundred ninety nine million" +
					" nine hundred ninety nine thousand" +
					" nine hundred and ninety nine"
				);
			});

			it("properly converts all the provided sample input", function() {
				assert.equal(numberToWords("0"), "Zero");
				assert.equal(numberToWords("13"), "Thirteen");
				assert.equal(numberToWords("85"), "Eighty five");
				assert.equal(numberToWords("5237"), "Five thousand two hundred and thirty seven");
			});

			it("inserts the 'and' at the proper location", function() {
				assert.equal(numberToWords("111"), "One hundred and eleven");
				assert.equal(numberToWords("1111"), "One thousand one hundred and eleven");
				assert.equal(numberToWords("1001"), "One thousand and one");
				assert.equal(numberToWords("101001"), "One hundred one thousand and one");
				assert.equal(numberToWords("1101001"), "One million one hundred one thousand and one");
				assert.equal(numberToWords("1001100"), "One million one thousand one hundred"); // no ands here
				assert.equal(numberToWords("1011000"), "One million eleven thousand"); // no ands here
			});
		});
	});

});
