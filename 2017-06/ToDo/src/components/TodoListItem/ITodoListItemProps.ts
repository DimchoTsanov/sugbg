import ITodoItem from '../../common/models/ITodoItem';
import ItemOperationCallback from '../../common/models/ItemOperationCallback';

interface ITodoListItemProps {
  item: ITodoItem;
  isChecked?: boolean;
  onCompleteListItem: ItemOperationCallback;
  onDeleteListItem: ItemOperationCallback;
}

export default ITodoListItemProps;