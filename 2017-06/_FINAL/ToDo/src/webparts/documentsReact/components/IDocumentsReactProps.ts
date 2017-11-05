import { DisplayMode } from '@microsoft/sp-core-library';
import ITodoDataProvider from '../../../dataProviders/ITodoDataProvider';

export interface IDocumentsReactProps {
  webPartDisplayMode: DisplayMode;
  dataProvider: ITodoDataProvider;
  configureStartCallback: () => void;
}