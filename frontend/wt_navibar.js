"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// tsd install react --save
// run watch mode "tsc -w"
/// <reference path="./typings/react/react.d.ts" />
var React = require("react");
var ReactDOM = require("react-dom");
var HelloWorld = (function (_super) {
    __extends(HelloWorld, _super);
    function HelloWorld() {
        _super.apply(this, arguments);
    }
    HelloWorld.prototype.render = function () {
        return React.createElement("div", null, "hello tsx? my name is ", this.props.name, "!! nice to meet you");
    };
    HelloWorld.prototype.toString = function () {
        return "hello tsx~! ^^";
    };
    return HelloWorld;
}(React.Component));
ReactDOM.render(React.createElement(HelloWorld, {name: "park junho"}), document.getElementById('wt_navi'));
