import { IWebPartContext } from '@microsoft/sp-webpart-base';
import ITodoItem from '../common/models/ITodoItem';
import ITodoTaskList from '../common/models/ITodoTaskList';
import {IBillingDoc } from '../common/ICommonObjects';

interface ITodoDataProvider {

    selectedList: ITodoTaskList;

    webPartContext: IWebPartContext;

    getTaskLists(): Promise<ITodoTaskList[]>;

    getItems(): Promise<ITodoItem[]>;

    createItem(title: string): Promise<ITodoItem[]>;

    updateItem(itemUpdated: ITodoItem): Promise<ITodoItem[]>;

    deleteItem(itemDeleted: ITodoItem): Promise<ITodoItem[]>;

    readBillingDocsForClient(): Promise<IBillingDoc[]>;
}

export default ITodoDataProvider;