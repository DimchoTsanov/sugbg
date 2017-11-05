
import * as React from "react";
import * as ReactDOM from "react-dom";

import TodoApp from "./components/TodoApp";
import TodoApp2 from "./components/App2";

import { Item } from './common/ICommonObjects';

//Example 1: Document Ready
document.addEventListener("DOMContentLoaded", function (event) {


    let initItems: Item[] = [
        { id: 1, text: "Learn React" },
        { id: 2, text: "Prepare demos" },
        { id: 3, text: "Try to look smart" }]

    let wrapperElement1 = document.getElementById("sugbgApp1");
    const element: React.ReactElement<{}> =
        React.createElement(
            TodoApp2,
            { items: initItems });
    ReactDOM.render(element, wrapperElement1);


    let wrapperElement2 = document.getElementById("sugbgApp2");
    const element2: React.ReactElement<{}> =
        React.createElement(
            TodoApp,
            { items: initItems });
    ReactDOM.render(element2, wrapperElement2);

});



