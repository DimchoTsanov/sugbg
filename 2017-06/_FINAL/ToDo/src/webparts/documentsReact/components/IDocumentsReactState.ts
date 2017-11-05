import { IBillingDoc } from '../../../common/ICommonObjects';
import { IColumn } from 'office-ui-fabric-react';

interface IDocumentsReactState {
    documents?: IBillingDoc[];
    isLoading?: boolean;
    columns?: IColumn[];
    isCalloutVisible?: boolean;
}

export default IDocumentsReactState;