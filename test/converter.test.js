import {assert} from "chai";
import {
	isValidNumber,
	__TEST_ONLY__
} from "../src/converter";

const _doubleDigitToWords = __TEST_ONLY__._doubleDigitToWords;
const _tripleDigitToWords = __TEST_ONLY__._tripleDigitToWords;

describe("converter", function() {

	describe("isValidNumber", function() {
		it("returns true for valid positive integers", function() {
			assert.isTrue(isValidNumber("0"));
			assert.isTrue(isValidNumber("1"));
			assert.isTrue(isValidNumber("9"));
			assert.isTrue(isValidNumber("11"));
			assert.isTrue(isValidNumber("1234567890"));
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
				assert.equal(_tripleDigitToWords("089", true, false), "eighty nine");
				assert.equal(_tripleDigitToWords("101", true, false), "one hundred one");
				assert.equal(_tripleDigitToWords("900", true, false), "nine hundred");
				assert.equal(_tripleDigitToWords("978", true, false), "nine hundred seventy eight");
			});
		});
	});

});
