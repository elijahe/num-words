import {assert} from "chai";
import {isValidNumber, getNumberOfTriplets, doubleDigitToWords} from "../src/converter";

describe("converter", function() {

	context("isValidNumber", function() {
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

	context("getNumberOfTriplets", function() {
		it("returns the correct number of triplets", function() {
			assert.equal(getNumberOfTriplets("0".length), 1);
			assert.equal(getNumberOfTriplets("11".length), 1);
			assert.equal(getNumberOfTriplets("111".length), 1);
			assert.equal(getNumberOfTriplets("2111".length), 2);
			assert.equal(getNumberOfTriplets("22111".length), 2);
			assert.equal(getNumberOfTriplets("222111".length), 2);
			assert.equal(getNumberOfTriplets("55444333222111".length), 5);
		});

		it("returns true for valid negative integers", function() {
			assert.isTrue(isValidNumber("-1"));
			assert.isTrue(isValidNumber("-11"));
			assert.isTrue(isValidNumber("-9"));
			assert.isTrue(isValidNumber("-9999999"));
		});
	});

	context("doubleDigitToWords", function() {
		it("returns the correct words for valid input", function() {
			assert.equal(doubleDigitToWords("00"), "");
			assert.equal(doubleDigitToWords("01"), "one");
			assert.equal(doubleDigitToWords("08"), "eight");
			assert.equal(doubleDigitToWords("10"), "ten");
			assert.equal(doubleDigitToWords("19"), "nineteen");
			assert.equal(doubleDigitToWords("20"), "twenty");
			assert.equal(doubleDigitToWords("42"), "forty two");
			assert.equal(doubleDigitToWords("89"), "eighty nine");
			assert.equal(doubleDigitToWords("90"), "ninety");
			assert.equal(doubleDigitToWords("99"), "ninety nine");
		});
	});

});
