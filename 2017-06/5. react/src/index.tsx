import * as React from "react";
import * as ReactDOM from "react-dom";

import { NavBasicExample } from "./components/Nav";

document.addEventListener("DOMContentLoaded", function (event) {

    let wrapperElements = document.getElementsByClassName("sugbg-app");
    if (wrapperElements.length > 0) {

        ReactDOM.render(<NavBasicExample />, wrapperElements[0]);
        console.log("ReactDOM.render is executed for left navigation");
    }
    //}
});
