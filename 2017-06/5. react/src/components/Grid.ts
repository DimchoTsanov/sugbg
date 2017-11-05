import IDocsDataProvider from '../dataProviders/IDocsDataProvider';
import { IDoc } from '../common/ICommonObjects';
import * as $ from "jquery";

export class JsGrid {

    _elementId: string;
    _dataProvider: IDocsDataProvider;

    public get dataProvider(): IDocsDataProvider { return this._dataProvider; }
    public set dataProvider(value: IDocsDataProvider) { this._dataProvider = value; }

    constructor(domElementId: string) {
        this._elementId = domElementId;
    }

    public RenderData() {
        $('#' + this._elementId).append("<div>Loading data...</div>");
        this._dataProvider.readDocsFromLibrary().then(
            (result: IDoc[]) => {
                debugger;
                this._renderIDcosArray(result)
            });

    }

    private _itemTemplate = "<li id='{0}'><a href='javascript:' onclick='{1}'>{2}</a></li>";

    private _renderIDcosArray(data: IDoc[]): void {

        let itemsAsLiHtml: string[] = [];
        let call = this._editDocument1.bind(this);
        // itemsAsLiHtml = data.map(function (item) {
        //     return "<li id='listItem" + item.Id + "' class='listItem' >" +
        //         "<a href='javascript:void(0)' onclick=alert('" + item.Id + "')>" + item.Name + "</a></li>";
        //     //Option 1
        //     // the onclick function must ne in the global namespace!
        // });
        // // / <a href='javascript:void(0)' onclick='"+ call(item) + "' >" + item.Name + "</a></li>";
        // $('#' + this._elementId)
        //     .html("<div>total documents: " + data.length + "</div><ul>" + itemsAsLiHtml.join('') + "</ul>");

        //Option 2
        // after the dom element is create, we can attach the onclick 

        let ul = document.createElement("UL");
        //Option 3:
        data.map(function (item) {

            let l = document.createElement("LI");
            var a = document.createElement("A");
            var t = document.createTextNode(item.Name);
            a.setAttribute("href", "javascript:void(0)");
            a.appendChild(t);
            l.setAttribute("class", "listItem");
            a.onclick = function () { call(item) };
            l.appendChild(a);
            ul.appendChild(l);
        });
        $('#' + this._elementId).empty().append(ul)

    }

    private _editDocument1(doc: IDoc): void {
        debugger;
        if (confirm("Do you want to edit " + doc.Name) == true) {

        }
    }
} 