// tsd install react --save
// run watch mode "tsc -w"
/// <reference path="./typings/react/react.d.ts" />
import * as React from "react";
import * as ReactDOM  from "react-dom";

interface HelloWorldProps {
    name: string;
}


class HelloWorld extends React.Component<HelloWorldProps, any> {
    render() {        
        return <div>hello tsx? my name is {this.props.name}!! nice to meet you</div>
    }
    toString() {
        return "hello tsx~! ^^";
    }
}

ReactDOM.render(<HelloWorld
    name="park junho"/>,
    document.getElementById('wt_navi'));