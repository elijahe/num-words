import React from "react";
import ReactDOM from "react-dom";

class NumWords extends React.Component {
	render() {
		return <input type="text" />;
	}
}

ReactDOM.render(
	<NumWords />,
	document.getElementById("root")
);
