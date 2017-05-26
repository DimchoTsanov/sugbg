import { IDoc } from '../../common/ICommonObjects';

interface IGridState {
    documents?: IDoc[];
    isLoading?: boolean;
}

export default IGridState;