import {assert} from "chai";
import Converter from "../../src/converter/converter";

const _doubleDigitToWords = Converter.__TEST_ONLY__._doubleDigitToWords;
const _tripleDigitToWords = Converter.__TEST_ONLY__._tripleDigitToWords;
const ERROR_INVALID_INTEGER = Converter.__TEST_ONLY__.ERROR_INVALID_INTEGER;
const ERROR_MAX_LENGTH_EXCEEDED = Converter.__TEST_ONLY__.ERROR_MAX_LENGTH_EXCEEDED;

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

	describe("isValidInteger", function() {
		it("returns true for valid positive integers", function() {
			assert.isTrue(Converter.isValidInteger("0"));
			assert.isTrue(Converter.isValidInteger("1"));
			assert.isTrue(Converter.isValidInteger("9"));
			assert.isTrue(Converter.isValidInteger("11"));
			assert.isTrue(Converter.isValidInteger("1234567890"));
			assert.isTrue(Converter.isValidInteger("1234567890123456789012345678901234567890"));
		});

		it("returns true for valid negative integers", function() {
			assert.isTrue(Converter.isValidInteger("-1"));
			assert.isTrue(Converter.isValidInteger("-11"));
			assert.isTrue(Converter.isValidInteger("-9"));
			assert.isTrue(Converter.isValidInteger("-9999999"));
		});

		it("returns false for numbers with delimiters", function() {
			assert.isFalse(Converter.isValidInteger("1,000"));
			assert.isFalse(Converter.isValidInteger("9,999,999"));
		});

		it("returns false for numbers with decimal points", function() {
			assert.isFalse(Converter.isValidInteger("0.1"));
			assert.isFalse(Converter.isValidInteger("1.1"));
		});

		it("returns false for numbers that start with 0", function() {
			assert.isFalse(Converter.isValidInteger("01"));
			assert.isFalse(Converter.isValidInteger("000001"));
		});

		it("returns false for input string with non numeric characters", function() {
			assert.isFalse(Converter.isValidInteger("b2"));
			assert.isFalse(Converter.isValidInteger("1a1"));
			assert.isFalse(Converter.isValidInteger("123c"));
			assert.isFalse(Converter.isValidInteger("100 1"));
			assert.isFalse(Converter.isValidInteger("$100"));
		});
	});

	describe("integerToWords", function() {
		context("invalid input", function() {
			it("throws an error for input containing unsupported characters", function() {
				assert.throws(Converter.integerToWords.bind(this, "1.1"), Error, ERROR_INVALID_INTEGER);
				assert.throws(Converter.integerToWords.bind(this, "$1"), Error, ERROR_INVALID_INTEGER);
				assert.throws(Converter.integerToWords.bind(this, "1,000"), Error, ERROR_INVALID_INTEGER);
			});

			it("throws an error for numbers that start with a 0", function() {
				assert.throws(Converter.integerToWords.bind(this, "012"), Error, ERROR_INVALID_INTEGER);
				assert.throws(Converter.integerToWords.bind(this, "0001"), Error, ERROR_INVALID_INTEGER);
			});

			it("throws an error for '-0'", function() {
				assert.throws(Converter.integerToWords.bind(this, "-0"), Error, ERROR_INVALID_INTEGER);
			});

			it("throws an error for input that exceeds the maximum supported length of digits", function() {
				assert.throws(
					Converter.integerToWords.bind(this, "1".repeat(Converter.MAX_NUM_DIGITS + 1)),
					Error,
					ERROR_MAX_LENGTH_EXCEEDED
				);
				assert.throws(
					Converter.integerToWords.bind(this, "-" + "1".repeat(Converter.MAX_NUM_DIGITS + 1)),
					Error,
					ERROR_MAX_LENGTH_EXCEEDED
				);
			});

			it("returns an empty string when given an empty string", function() {
				assert.equal(Converter.integerToWords(""), "");
			});
		});

		context("valid input", function() {
			it("properly converts single digits", function() {
				assert.equal(Converter.integerToWords("0"), "Zero");
				assert.equal(Converter.integerToWords("1"), "One");
				assert.equal(Converter.integerToWords("-1"), "Negative one");
				assert.equal(Converter.integerToWords("2"), "Two");
				assert.equal(Converter.integerToWords("-2"), "Negative two");
				assert.equal(Converter.integerToWords("9"), "Nine");
				assert.equal(Converter.integerToWords("-9"), "Negative nine");
			});

			it("properly converts double digits", function() {
				assert.equal(Converter.integerToWords("10"), "Ten");
				assert.equal(Converter.integerToWords("-10"), "Negative ten");
				assert.equal(Converter.integerToWords("11"), "Eleven");
				assert.equal(Converter.integerToWords("-11"), "Negative eleven");
				assert.equal(Converter.integerToWords("15"), "Fifteen");
				assert.equal(Converter.integerToWords("-15"), "Negative fifteen");
			});

			it("properly converts triple digits", function() {
				assert.equal(Converter.integerToWords("100"), "One hundred");
				assert.equal(Converter.integerToWords("-100"), "Negative one hundred");
				assert.equal(Converter.integerToWords("111"), "One hundred and eleven");
				assert.equal(Converter.integerToWords("-111"), "Negative one hundred and eleven");
				assert.equal(Converter.integerToWords("600"), "Six hundred");
				assert.equal(Converter.integerToWords("-600"), "Negative six hundred");
				assert.equal(Converter.integerToWords("901"), "Nine hundred and one");
				assert.equal(Converter.integerToWords("987"), "Nine hundred and eighty seven");
				assert.equal(Converter.integerToWords("999"), "Nine hundred and ninety nine");
			});

			it("properly converts thousands", function() {
				assert.equal(Converter.integerToWords("1000"), "One thousand");
				assert.equal(Converter.integerToWords("1100"), "One thousand one hundred");
				assert.equal(Converter.integerToWords("1101"), "One thousand one hundred and one");
				assert.equal(Converter.integerToWords("1111"), "One thousand one hundred and eleven");
				assert.equal(Converter.integerToWords("2222"), "Two thousand two hundred and twenty two");
				assert.equal(Converter.integerToWords("-1000"), "Negative one thousand");
				assert.equal(Converter.integerToWords("-2222"), "Negative two thousand two hundred and twenty two");
				assert.equal(Converter.integerToWords("10000"), "Ten thousand");
				assert.equal(Converter.integerToWords("10208"), "Ten thousand two hundred and eight");
				assert.equal(Converter.integerToWords("100208"), "One hundred thousand two hundred and eight");
				assert.equal(Converter.integerToWords("101101"), "One hundred one thousand one hundred and one");
			});

			it("properly converts millions and above", function() {
				assert.equal(Converter.integerToWords("1000000"), "One million");
				assert.equal(Converter.integerToWords("1101101"), "One million one hundred one thousand one hundred and one");
				assert.equal(Converter.integerToWords("9000000000"), "Nine billion");
				assert.equal(Converter.integerToWords("9000000000000"), "Nine trillion");
				assert.equal(Converter.integerToWords("9000000000000000"), "Nine quadrillion");
				assert.equal(Converter.integerToWords("9000000000001000"), "Nine quadrillion one thousand");
				assert.equal(Converter.integerToWords("9000000000000000000000000283000"), "Nine nonillion two hundred eighty three thousand");
				assert.equal(Converter.integerToWords("9000000000000000000000000000000000000000000000000000000001000001"), "Nine vigintillion one million and one");
				assert.equal(Converter.integerToWords("999000000000000000000000000000000000000000000000000000000001000001"), "Nine hundred ninety nine vigintillion one million and one");
				assert.equal(
					Converter.integerToWords("9".repeat(Converter.MAX_NUM_DIGITS)),
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
					Converter.integerToWords("-" + "9".repeat(Converter.MAX_NUM_DIGITS)),
					"Negative nine hundred ninety nine vigintillion" +
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
				assert.equal(Converter.integerToWords("0"), "Zero");
				assert.equal(Converter.integerToWords("13"), "Thirteen");
				assert.equal(Converter.integerToWords("85"), "Eighty five");
				assert.equal(Converter.integerToWords("5237"), "Five thousand two hundred and thirty seven");
			});

			it("inserts the 'and' at the proper location", function() {
				assert.equal(Converter.integerToWords("111"), "One hundred and eleven");
				assert.equal(Converter.integerToWords("1111"), "One thousand one hundred and eleven");
				assert.equal(Converter.integerToWords("1001"), "One thousand and one");
				assert.equal(Converter.integerToWords("101001"), "One hundred one thousand and one");
				assert.equal(Converter.integerToWords("1101001"), "One million one hundred one thousand and one");
				assert.equal(Converter.integerToWords("1001100"), "One million one thousand one hundred"); // no ands here
				assert.equal(Converter.integerToWords("1011000"), "One million eleven thousand"); // no ands here
			});
		});
	});

});
