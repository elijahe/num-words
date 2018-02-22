import Colors from "../constants/colors";
import Converter from "../converter/converter";
import React from "react";
import StyledComponents, {keyframes} from "styled-components";

const highlight = keyframes`
	0% {
		border-width: 1px;
	}

	50% {
		border-width: 4px;
	}

	100% {
		border-width: 2px;
	}
`;

const slideIn = keyframes`
	0% {
		transform: translateY(-100%);
	}

	100% {
		transform: translateY(0);
	}
`;

export const Wrapper = StyledComponents.div`
	align-items: center;
	animation: ${slideIn} 1s ease-out;
	color: Colors.FONT;
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: center;
	width: 100%;
`;

export const InputLabel = StyledComponents.span`
	color: ${Colors.LABEL_FONT};
	flex: 0 0 auto;
	font-size: 0.9em;
	opacity: ${({isVisible}) => isVisible ? "1" : "0"};
	overflow: hidden;
	outline: none;
	padding: 0.2em 1em;
	transition: opacity 0.2s ease;
	width: 75%;
`;

export const InputField = StyledComponents.input`
	animation: ${({hasError}) => hasError ? highlight + " 0.3s ease-in-out" : "none"};
	background-color: ${Colors.INPUT_FIELD_BACKGROUND};
	border: solid 2px;
	border-color: ${({hasError}) => hasError ? Colors.ERROR : Colors.INPUT_FIELD_BORDER};
	border-radius: 10px;
	color: ${Colors.FONT};
	flex: 0 0 auto;
	font-family: inherit;
	font-size: 1em;
	outline: none;
	padding: 0.4em 1em;
	width: 75%;
`;

export const OutputField = StyledComponents.div`
	color: ${({hasError}) => hasError ? Colors.ERROR : Colors.FONT};
	flex: 0 1 auto;
	font-size: 1.1em;
	min-height: 4em;
	margin: 2em 0;
	opacity: ${({containsText}) => containsText ? "1" : "0"};
	overflow: auto;
	transition: opacity 0.4s ease;
	width: 75%;
`;

export default class AppController extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inputString: "",
			convertedString: "",
			errorString: ""
		};

		this.onInputChange = this.onInputChange.bind(this);
	}

	componentDidMount() {
		this.inputFieldNode.focus();
	}

	onInputChange(event) {
		this.setState ({
			inputString: event.target.value,
			convertedString: "",
			errorString: ""
		}, () => {
			try {
				this.setState({
					convertedString: Converter.integerToWords(this.state.inputString.trim()),
					errorString: ""
				});
			} catch (error) {
				this.setState({
					errorString: error.message
				});
			}
		});
	}

	render() {
		const hasError = "" !== this.state.errorString;
		const placeholderString = "Enter any integer (max " + Converter.MAX_NUM_DIGITS + " digits)";
		return <Wrapper>
			<InputLabel
				isVisible={"" !== this.state.inputString}
			>
				{placeholderString}
			</InputLabel>
			<InputField
				type="text"
				innerRef={(node) => this.inputFieldNode = node}
				placeholder={placeholderString}
				value={this.state.inputString}
				hasError={hasError}
				onChange={this.onInputChange}
			/>
			<OutputField
				containsText={hasError || "" !== this.state.convertedString}
				hasError={hasError}
			>
				{this.state.errorString || this.state.convertedString}
			</OutputField>
		</Wrapper>;
	}
}
