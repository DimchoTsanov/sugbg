import ITodoItem from '../../common/models/ITodoItem';
import ItemOperationCallback from '../../common/models/ItemOperationCallback';

interface ITodoListProps {
  items: ITodoItem[];
  onCompleteTodoItem: ItemOperationCallback;
  onDeleteTodoItem: ItemOperationCallback;
}

export default ITodoListProps;