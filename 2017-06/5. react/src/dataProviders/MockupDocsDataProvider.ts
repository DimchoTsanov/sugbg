
import IDocsDataProvider from "./IDocsDataProvider";
import { IDoc } from "../common/ICommonObjects";

export default class MockupDocsDataProvider implements IDocsDataProvider {


    private _curentUserId: number;

    private _clientShortName: string;
    private _itemId: number;

    constructor() {

    }

    public readDocsFromLibrary(): Promise<IDoc[]> {

        let docs: IDoc[] = [];

        for (let i = 0; i < 4000; i++) {

            let newDocuments: IDoc = {
                Id: i,
                Name: 'document test ' + i.toString() + '.docx'
            };
            docs.push(newDocuments);
        }

        return new Promise<IDoc[]>((resolve) => {

            setTimeout(() => {
                resolve(docs);
            }, 2000);
        });

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

}