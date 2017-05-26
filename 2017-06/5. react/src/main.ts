
import * as React from "react";
import * as ReactDOM from "react-dom";
declare var _spPageContextInfo: any;

import { NavBasicExample } from "./components/Nav";
import Grid from "./components/reactGrid/Grid";

import { IGridProps } from "./components/reactGrid/IGridProps";
import IDocsDataProvider from "./dataProviders/IDocsDataProvider";
import MockupDocsDataProvider from "./dataProviders/MockupDocsDataProvider";
import DocsDataProvider from "./dataProviders/DocsDataProvider";

//Example 1: Document Ready
document.addEventListener("DOMContentLoaded", function (event) {

    let wrapperElements = document.getElementsByClassName("sugbg-app");
    if (wrapperElements.length > 0) {
        debugger;
        let _dataProvider: IDocsDataProvider;
        let isSPContext = false;
        //logic to identify if we are in SharePoint
        if (window.location.host == 'mstnd901684.sharepoint.com') {
            isSPContext = true;
        }


        if (isSPContext) {
            var listId = "28ad3d9f-ff65-40de-a824-1cb43b92f0bd";
            var listRelUrl = "/sites/sugbg/Docs";
            var webUrl = "https://mstnd901684.sharepoint.com/sites/sugbg";

            _dataProvider = new DocsDataProvider(listId, listRelUrl, webUrl);
        }
        else {
            _dataProvider = new MockupDocsDataProvider();
        }

        const element: React.ReactElement<IGridProps> = React.createElement(
            Grid,
            {
                dataProvider: _dataProvider,
            }
        );
        ReactDOM.render(element, wrapperElements[0]);

        console.log("ReactDOM.render is executed for React Grid");
    }

});

//Example 2: Register Global function
//Global function that will be called from the Custom Action in Clients list
(<any>window).SugbgGlobalFollowClient = function (itemId, listId) {
    console.log(itemId + " | " + listId);
    // execute your logic
}


