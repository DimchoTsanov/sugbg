import {
  SPHttpClient,
  SPHttpClientBatch,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import ITodoDataProvider from '../dataProviders/ITodoDataProvider';
import ITodoItem from '../common/models/ITodoItem';
import ITodoTaskList from '../common/models/ITodoTaskList';
import { DebugLog, DebugLogWithMessage } from '../common/Utils';
import { IBillingDoc } from '../common/ICommonObjects';

export default class SharePointDataProvider implements ITodoDataProvider {

  private _selectedList: ITodoTaskList;
  private _taskLists: ITodoTaskList[];
  private _listsUrl: string;
  private _listItemsUrl: string;
  private _webPartContext: IWebPartContext;

  public set selectedList(value: ITodoTaskList) {
    this._selectedList = value;
    this._listItemsUrl = `${this._listsUrl}(guid'${value.Id}')/items`;
  }

  public get selectedList(): ITodoTaskList {
    return this._selectedList;
  }

  public set webPartContext(value: IWebPartContext) {
    this._webPartContext = value;
    this._listsUrl = `${this._webPartContext.pageContext.web.absoluteUrl}/_api/web/lists`;
  }

  public get webPartContext(): IWebPartContext {
    return this._webPartContext;
  }

  public getTaskLists(): Promise<ITodoTaskList[]> {
    const listTemplateId: string = '171';
    const queryString: string = `?$filter=BaseTemplate eq ${listTemplateId}`;
    const queryUrl: string = this._listsUrl + queryString;

    return this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((json: { value: ITodoTaskList[] }) => {
        return this._taskLists = json.value;
      });
  }

  public getItems(): Promise<ITodoItem[]> {
    return this._getItems(this.webPartContext.spHttpClient);
  }

  public createItem(title: string): Promise<ITodoItem[]> {
    const batch: SPHttpClientBatch = this.webPartContext.spHttpClient.beginBatch();

    const batchPromises: Promise<{}>[] = [
      this._createItem(batch, title),
      this._getItemsBatched(batch)
    ];

    return this._resolveBatch(batch, batchPromises);
  }

  public deleteItem(itemDeleted: ITodoItem): Promise<ITodoItem[]> {
    const batch: SPHttpClientBatch = this.webPartContext.spHttpClient.beginBatch();

    const batchPromises: Promise<{}>[] = [
      this._deleteItem(batch, itemDeleted),
      this._getItemsBatched(batch)
    ];

    return this._resolveBatch(batch, batchPromises);
  }

  public updateItem(itemUpdated: ITodoItem): Promise<ITodoItem[]> {
    const batch: SPHttpClientBatch = this.webPartContext.spHttpClient.beginBatch();

    const batchPromises: Promise<{}>[] = [
      this._updateItem(batch, itemUpdated),
      this._getItemsBatched(batch)
    ];

    return this._resolveBatch(batch, batchPromises);
  }

  public readBillingDocsForClient(): Promise<IBillingDoc[]> {

    return this._readBillingDocsForClient(this.webPartContext.spHttpClient, "")
      .then((documents: IBillingDoc[]) => {
        //successResponse represents clients objects
        // pass this array to the next function which will updat the IClient.FollowedBy property
        debugger;
        return documents;
      }).catch((ex) => {
        debugger;
        DebugLogWithMessage("readBillingDocsForClient > ...catch:", ex);
        return Promise.reject(ex);
      });

  }

  private _getItems(requester: SPHttpClient): Promise<ITodoItem[]> {
    const queryString: string = `?$select=Id,Title,PercentComplete`;
    const queryUrl: string = this._listItemsUrl + queryString;

    return requester.get(queryUrl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((json: { value: ITodoItem[] }) => {
        return json.value.map((task: ITodoItem) => {
          return task;
        });
      });
  }

  private _getItemsBatched(requester: SPHttpClientBatch): Promise<ITodoItem[]> {
    const queryString: string = `?$select=Id,Title,PercentComplete`;
    const queryUrl: string = this._listItemsUrl + queryString;

    return requester.get(queryUrl, SPHttpClientBatch.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((json: { value: ITodoItem[] }) => {
        return json.value.map((task: ITodoItem) => {
          return task;
        });
      });
  }


  private _createItem(batch: SPHttpClientBatch, title: string): Promise<SPHttpClientResponse> {
    const body: {} = {
      '@data.type': `${this._selectedList.ListItemEntityTypeFullName}`,
      'Title': title
    };

    return batch.post(
      this._listItemsUrl,
      SPHttpClientBatch.configurations.v1,
      { body: JSON.stringify(body) }
    );
  }

  private _deleteItem(batch: SPHttpClientBatch, item: ITodoItem): Promise<SPHttpClientResponse> {
    const itemDeletedUrl: string = `${this._listItemsUrl}(${item.Id})`;

    const headers: Headers = new Headers();
    headers.append('If-Match', '*');

    return batch.fetch(itemDeletedUrl,
      SPHttpClientBatch.configurations.v1,
      {
        headers,
        method: 'DELETE'
      }
    );
  }

  private _updateItem(batch: SPHttpClientBatch, item: ITodoItem): Promise<SPHttpClientResponse> {

    const itemUpdatedUrl: string = `${this._listItemsUrl}(${item.Id})`;

    const headers: Headers = new Headers();
    headers.append('If-Match', '*');

    const body: {} = {
      '@data.type': `${this._selectedList.ListItemEntityTypeFullName}`,
      'PercentComplete': item.PercentComplete
    };

    return batch.fetch(itemUpdatedUrl,
      SPHttpClientBatch.configurations.v1,
      {
        body: JSON.stringify(body),
        headers,
        method: 'PATCH'
      }
    );
  }

  private _resolveBatch(batch: SPHttpClientBatch, promises: Promise<{}>[]): Promise<ITodoItem[]> {
    return batch.execute()
      .then(() => Promise.all(promises).then(values => values[values.length - 1]));
  }

  private _readBillingDocsForClient(requester: SPHttpClient, shortName: string): Promise<IBillingDoc[]> {

    //let webServerRelativeUrl = this._webPartContext.pageContext.web.serverRelativeUrl;

    let webAbsoluteUrl = this._webPartContext.pageContext.web.absoluteUrl;
    const queryUrlGetBillingDocs: string = `${webAbsoluteUrl}/_api/search/query` +
      `?querytext='isdocument:1'` +
      //`?querytext='(RefinableString02:` + shortName + `)AND((RefinableString08=Billing)OR(RefinableString08=Contract))'` +
      `&rowlimit=1000` +
      `&trimduplicates=false` +
      `&selectproperties='DocId,ModifiedBy,OriginalPath,LastModifiedTime,FileExtension,Path'`;// +
    //`&sortlist='RefinableString04:descending'`;

    DebugLog("_readBillingDocsForClient > rest call url:" + queryUrlGetBillingDocs);

    return requester.get(queryUrlGetBillingDocs,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "odata-version": "3.0",
          "accept": "application/json;odata=verbose"
        }
      }).then((response: any) => {
        debugger;
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(JSON.stringify(response)));
        }

      })
      .then((response: any) => {

        debugger;
        //parse responce rows to objects
        let results: any[] = response.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
        var obj = [];
        for (let l = 0; l < results.length; l++) {
          var cells = results[l].Cells.results;
          var cell = {};
          for (let m = 0; m < cells.length; m++) {
            cell[cells[m].Key] = cells[m].Value;
          }
          obj.push(cell);
        }

        let docs: IBillingDoc[] = [];
        for (let i = 0; i < obj.length; i++) {

          docs.push({
            Id: parseInt(obj[i].DocId),
            FileRef: this._getFileRef(obj[i].OriginalPath),
            Modified: this._getFormatedDate(obj[i].LastModifiedTime),
            ModifiedBy: obj[i].ModifiedBy,
            FileIcon: this._getImgUrlByFileExtension(obj[i].FileExtension),
            Name: this._getFileName(obj[i].Path),
          });
        }
        return docs;
      }).catch((e) => {
        DebugLogWithMessage("_readBillingDocsForClient > requester.get()...catch:", e);
        return Promise.reject(e);
      });

  }

  private _getImgUrl(fileName: string): string {

    let fileNameItems = fileName.split('.');
    let fileExtenstion = fileNameItems[fileNameItems.length - 1];

    return this._getImgUrlByFileExtension(fileExtenstion);
  }

  private _getImgUrlByFileExtension(extension: string): string {

    let imgRoot: string = "https://spoprod-a.akamaihd.net/files/odsp-next-prod_ship-2017-04-21-sts_20170503.001/odsp-media/images/filetypes/16/";
    let imgType = "genericfile.png";

    imgType = extension + ".png";
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "jfif":
      case "gif":
      case "png":
        imgType = "photo.png";
        break;
    }

    return imgRoot + imgType;
  }

  private _getFormatedDate(dateString: string): string {
    let convertedDate: Date = new Date(dateString);
    //ToDo: confirm the string format with the requirements
    //return convertedDate.toLocaleString();

    let date =
      //  (convertedDate.getMonth() + 1) + '/' + convertedDate.getDate() + '/' + convertedDate.getFullYear() + " "
      //     + convertedDate.getHours() + ":"
      //     + convertedDate.getMinutes() + ":"
      //     + convertedDate.getSeconds() + " // " + 
      convertedDate.toLocaleString();
    //console.log(date);
    return date;
  }

  private _getDateOnly(dateString: string): string {
    let shortDate = "";
    if (dateString) {
      let dateItems = dateString.split(" ");
      if (dateItems.length > 1) {
        shortDate = dateItems[0];
      }
    }
    let convertedDate: Date = new Date(dateString);
    //ToDo: confirm the string format with the requirements
    return shortDate;
  }

  private _getFileName(fileAbsoluteUrl: string): string {
    let items = fileAbsoluteUrl.split('/');
    return items[items.length - 1];
  }

  private _getFileRef(fileAbsoluteUrl: string): string {
    return fileAbsoluteUrl.replace(window.location.origin, "");
  }
}