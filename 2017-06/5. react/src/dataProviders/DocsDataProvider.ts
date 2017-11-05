
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
        //using jQuery
        return this._getFavoriteDocsForClient_JQuery();

        // //using fetch
        // return this._getFavoriteDocsForClient_fetch();
    }


    private _getFavoriteDocsForClient_JQuery(): Promise<IDoc[]> {

        // Rest queries options
        ///_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/sugbg/Docs')?$expand=Files
        ///_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/sugbg/Docs')?$expand=Folders,Files&$select=FileRef,Modified,FileLeafRef,Editor/Id,Editor/Title,*&$expand=Editor
        ///_api/web/Lists/GetByTitle('DocLib')/GetItems(query=@v1)?$select=Title,File/Name&$expand=File&@v1={"FolderServerRelativeUrl" : "/SubSite1/SubSite1.2/DocLib/SubFolder1/SubFolder1.3", "ViewXml":"<View Scope='RecursiveAll'></View>"}";

        let webAbsoluteUrl = this._webAbsoluteUrl;
        //const queryUrlGetAllItems1: string = `${webAbsoluteUrl}/_api/web/lists(guid'${this._listId}')/items`;
        //const queryUrlGetAllItems: string = `${webAbsoluteUrl}/_api/web/GetFolderByServerRelativePath(decodedurl='${this._listRelativeUrl}')`;// +
        //`?$expand=Folders,Files`;//&$select=FileRef,Modified,FileLeafRef`;//,Editor/Id,Editor/Title,*&$expand=Editor`;


        const queryUrlGetAllItems: string = `${webAbsoluteUrl}/_api/web/Lists/lists(guid'${this._listId}')/GetItems(query=@v1)` +
            `?$select=ID,FileLeafRef,FileRef,File/Name&,Editor/Id,Editor/Title$expand=File,Editor` +
            `&@v1={"FolderServerRelativeUrl" : "/sites/sugbg/Docs", "ViewXml":"<View Scope='RecursiveAll'></View>"}`;

        DebugLog("_getClientsItems > rest call url:" + queryUrlGetAllItems);

        //Get items method requires POST
        // /_api/web/lists(guid'${this._listId}')/items requires GET
        return Promise.resolve($.ajax({
            url: queryUrlGetAllItems,
            method: "POST", // or "GET"
            headers: {
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": "*"
            },
            dataType: "json",
            success: function (data) {
                debugger;
                var test = "";
                if (data.d) {
                    return data.d.results;
                }
                else {
                    return [];
                }
            }.bind(this),
            error: function (data) {
                console.log("Error: " + data);
            }
        })
        ).then((data: any): Promise<IDoc[]> => {

            let documents: IDoc[] = [];

            //if the query returns only documents
            if (data.d) {
                documents = data.d.results.map(item => {
                    //convert List Item to Document object
                    var doc: IDoc = {
                        Id: item.Id,
                        FileRef: item.FileRef,
                        Name: item.FileLeafRef, /// File.Name will work for Document items
                    }
                    return doc
                });
            }

            // if the query returns Files and Fodelrs
            // if (data.d && data.d.Files) {
            //     documents = data.d.Files.results.map(item => {
            //         //convert File Item to IFollowPerson object
            //         // item.Id is undefine, additional call for properties is needed;
            //         var doc: IDoc = { Id: item.Id }
            //         return doc
            //     });
            // }

            return new Promise<IDoc[]>((resolve) => { resolve(documents); });

        });
    }

    private _getFavoriteDocsForClient_fetch(): Promise<IDoc[]> {

        let webAbsoluteUrl = this._webAbsoluteUrl;
        const queryUrlGetAllItems1: string = `${webAbsoluteUrl}/_api/web/lists(guid'${this._listId}')/items`;

        const queryUrlGetAllItems: string = `${webAbsoluteUrl}/_api/web/GetFolderByServerRelativePath(decodedurl = '${this._listRelativeUrl}') ` +
            `?$expand=Folders,Files`;//&$select=FileRef,Modified,FileLeafRef`;//,Editor/Id,Editor/Title,*&$expand=Editor`;

        // `?$filter=ClientShortName eq '` + shortName + `'` + // get favorite documets for specific client
        // `&$select=ClientShortName,Document/Modified,*&$expand=Document&$orderby=Document/Modified desc` +
        // `&$top=5000`; //defualt is 100

        DebugLog("_getClientsItems > rest call url:" + queryUrlGetAllItems);

        //return requester.get(queryUrlGetAllClients, SPHttpClient.configurations.v1)
        var requestDig: any = document.getElementById("__REQUESTDIGEST");
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
                        //convert List Item to Document object
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
    }
}