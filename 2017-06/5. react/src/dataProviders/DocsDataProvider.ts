
//import { SPHttpClient } from '@microsoft/sp-http';
import 'whatwg-fetch'
import * as $ from "jquery";
import IDocsDataProvider from "./IDocsDataProvider";
import { IDoc, ISPUser } from "../common/ICommonObjects";
import { DebugLog, DebugLogWithMessage } from '../common/Utils';

export default class DocsDataProvider implements IDocsDataProvider {

    private _curentUser: ISPUser;

    private _listId: string;
    private _webAbsoluteUrl: string;
    private _listRelativeUrl: string;

    constructor(listId: string, listRelUrl: string, webUrl: string) {
        this._listId = listId;
        this._webAbsoluteUrl = webUrl;
        this._listRelativeUrl = listRelUrl;
    }

    public readDocsFromLibrary(): Promise<IDoc[]> {

        return this._getFavoriteDocsForClient()
    }

    public editDoc(item: IDoc): Promise<IDoc> {
        return new Promise<IDoc>((resolve) => {
            setTimeout(() => {
                item.Name = "[ Edited ] " + item.Name;
                resolve(item);
            }, 2000);
        });

    }

    public readDocsFromSearch(): Promise<IDoc[]> {

        let docs: IDoc[] = [];
        return new Promise<IDoc[]>((resolve) => {
            setTimeout(() => {
                resolve(docs);
            }, 2000);
        });
    }



    private _getFavoriteDocsForClient(): Promise<IDoc[]> {

        //https://server/_api/Web/GetFolderByServerRelativeUrl(<folder url>)?$expand=Files
        //https://mstnd901684.sharepoint.com/sites/sugbg/_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/sugbg/Docs')/Files
        //https://mstnd901684.sharepoint.com/sites/sugbg/_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/sugbg/Docs')?$expand=Folders,Files&$select=FileRef,Modified,FileLeafRef,Editor/Id,Editor/Title,*&$expand=Editor

        let webAbsoluteUrl = this._webAbsoluteUrl;
        const queryUrlGetAllItems1: string = `${webAbsoluteUrl}/_api/web/lists(guid'${this._listId}')/items`;

        const queryUrlGetAllItems: string = `${webAbsoluteUrl}/_api/web/GetFolderByServerRelativePath(decodedurl='${this._listRelativeUrl}')` +
            `?$expand=Folders,Files`;//&$select=FileRef,Modified,FileLeafRef`;//,Editor/Id,Editor/Title,*&$expand=Editor`;

        // `?$filter=ClientShortName eq '` + shortName + `'` + // get favorite documets for specific client
        // `&$select=ClientShortName,Document/Modified,*&$expand=Document&$orderby=Document/Modified desc` +
        // `&$top=5000`; //defualt is 100
        //Document/Modified
        //ToDo add projected fileds query for Followers/Title

        DebugLog("_getClientsItems > rest call url:" + queryUrlGetAllItems);

        //return requester.get(queryUrlGetAllClients, SPHttpClient.configurations.v1)
        var requestDig: any = document.getElementById("__REQUESTDIGEST");
        // return 
        return fetch(queryUrlGetAllItems,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose",
                    // "Content-Type": "application/json",
                    // "X-RequestDigest": requestDig.value

                },
                credentials: "same-origin"

                // body: JSON.stringify({
                //     "__metadata": { "type": "SP.Data.DocsListItem" }
                // })

            })
            .then((response: any) => {
                debugger;
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return Promise.reject(new Error(JSON.stringify(response)));
                }
            })
            .then((data: any) => {
                debugger;
                let documents: IDoc[] = [];

                if (data.d) {
                    documents = data.d.results.map(item => {
                        //convert List Item to IFollowPerson object
                        var doc: IDoc = {
                            Id: item.Id,
                            FileRef: item.FileRef,
                            Name: item.FileLeafRef,
                            // ModifiedBy: item.Editor
                        }
                        return doc
                    });
                }
                return documents;

            }).catch((e) => {
                DebugLogWithMessage("_getFavoriteDocsForClient > requester.get()...catch:", e);
                return Promise.reject(e);
            });

        // Promise.resolve($.ajax({
        //     url: queryUrlGetAllItems,
        //     method: "GET",
        //     headers: { "Accept": "application/json; odata=verbose" },
        //     dataType: "json",
        //     success: function (data) {
        //         debugger;
        //         var test = "";
        //         if (data.d) {
        //             return data.d.results;
        //         }

        //         else {
        //             return [];
        //         }

        //     }.bind(this),
        //     error: function (data) {
        //         console.log("Error: " + data);
        //     }
        // })
        // ).then((data: any): Promise<IDoc[]> => {

        //     let documents: IDoc[] = [];

        //     if (data.d) {
        //         documents = data.d.results.map(item => {
        //             //convert List Item to IFollowPerson object
        //             var doc: IDoc = { Id: item.Id }
        //             return doc
        //         });
        //     }

        //     return new Promise<IDoc[]>((resolve) => { resolve(documents); });

        // });
    }
}