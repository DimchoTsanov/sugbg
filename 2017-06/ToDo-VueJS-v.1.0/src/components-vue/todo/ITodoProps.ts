import ITodoDataProvider from '../../dataProviders/ITodoDataProvider';
import { DisplayMode } from '@microsoft/sp-core-library';

export interface ITodoProps {
    message: string;
    todos: string[];
}

export interface ITodoProps2 {
    dataProvider: ITodoDataProvider;
    webPartDisplayMode: DisplayMode;
    
}