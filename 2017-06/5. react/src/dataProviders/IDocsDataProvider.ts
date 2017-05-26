
import { IDoc, } from "../common/ICommonObjects";

interface IDocsDataProvider {

    readDocsFromLibrary(): Promise<IDoc[]>;

    editDoc(item: IDoc): Promise<IDoc>;

    readDocsFromSearch(): Promise<IDoc[]>;
}

export default IDocsDataProvider;
