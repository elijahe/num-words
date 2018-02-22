import Adapter from "enzyme-adapter-react-16";
import {assert} from "chai";
import Enzyme, {mount} from "enzyme";
import React from "react";

import AppController, {InputField, OutputField} from "../../src/components/app-controller";
import Converter from "../../src/converter/converter";

describe("AppController", function() {

	before(function() {
		Enzyme.configure({
			adapter: new Adapter()
		});
	});

	it("mounts and unmounts cleanly", function() {
		assert.doesNotThrow(() => {
			mount(<AppController />).unmount();
		});
	});

	it("shows properly converted integers in output field", function() {
		const wrapper = mount(<AppController />);
		const inputField = wrapper.find(InputField);
		const outputField = wrapper.find(OutputField);

		inputField.simulate("change", {target: {value: "1"}});

		assert.equal(outputField.text(), "One");
		wrapper.unmount();
	});

	it("trims leading and trailing whitespace", function() {
		const wrapper = mount(<AppController />);
		const inputField = wrapper.find(InputField);
		const outputField = wrapper.find(OutputField);

		inputField.simulate("change", {target: {value: " 1 "}});

		assert.equal(outputField.text(), "One");
		wrapper.unmount();
	});

	it("shows an error in the output field for invalid entries", function() {
		const wrapper = mount(<AppController />);
		const inputField = wrapper.find(InputField);
		const outputField = wrapper.find(OutputField);

		inputField.simulate("change", {target: {value: "-0"}});

		assert.equal(outputField.text(), Converter.__TEST_ONLY__.ERROR_INVALID_INTEGER);
		wrapper.unmount();
	});

	it("shows an error in the output field for input that exceeds the max supported length", function() {
		const wrapper = mount(<AppController />);
		const inputField = wrapper.find(InputField);
		const outputField = wrapper.find(OutputField);

		inputField.simulate("change", {target: {value: "1".repeat(Converter.MAX_NUM_DIGITS + 1)}});

		assert.equal(outputField.text(), Converter.__TEST_ONLY__.ERROR_MAX_LENGTH_EXCEEDED);
		wrapper.unmount();
	});

	it("clears the output field when the input is cleared", function() {
		const wrapper = mount(<AppController />);
		const inputField = wrapper.find(InputField);
		const outputField = wrapper.find(OutputField);

		inputField.simulate("change", {target: {value: "-0"}});
		inputField.simulate("change", {target: {value: ""}});

		assert.equal(outputField.text(), "");
		wrapper.unmount();
	});

});
