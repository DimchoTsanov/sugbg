import { DisplayMode } from '@microsoft/sp-core-library';
import ITodoDataProvider from '../../../dataProviders/ITodoDataProvider';

interface ITodoReactProps {
  dataProvider: ITodoDataProvider;
  webPartDisplayMode: DisplayMode;
  configureStartCallback: () => void;
}

export default ITodoReactProps;