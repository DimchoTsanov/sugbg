import * as React from 'react';
import styles from './TodoReact.module.scss';
import ITodoReactState from './ITodoReactState';
import ITodoReactProps from './ITodoReactProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DisplayMode } from '@microsoft/sp-core-library';
import { Placeholder } from '@microsoft/sp-webpart-base';
import { Fabric } from 'office-ui-fabric-react';
import TodoForm from '../../../components/TodoForm/TodoForm';
import ITodoItem from '../../../common/models/ITodoItem';
import TodoList from '../../../components/TodoList/TodoList';

import * as update from 'immutability-helper';

export default class TodoReact extends React.Component<ITodoReactProps, ITodoReactState> {


  private _showPlaceHolder: boolean = true;

  constructor(props: ITodoReactProps) {
    super(props);

    if (this.props.dataProvider.selectedList) {
      if (this.props.dataProvider.selectedList.Id !== '0') {
        this._showPlaceHolder = false;
      }
      else if (this.props.dataProvider.selectedList.Id === '0') {
        this._showPlaceHolder = true;
      }
    } else {
      this._showPlaceHolder = true;
    }

    this.state = {
      todoItems: []
    };

    this._configureWebPart = this._configureWebPart.bind(this);
    this._createTodoItem = this._createTodoItem.bind(this);
    this._completeTodoItem = this._completeTodoItem.bind(this);
    this._deleteTodoItem = this._deleteTodoItem.bind(this);
  }

  public componentWillReceiveProps(props: ITodoReactProps) {
    if (this.props.dataProvider.selectedList) {
      if (this.props.dataProvider.selectedList.Id !== '0') {
        this._showPlaceHolder = false;
        this.props.dataProvider.getItems().then(
          (items: ITodoItem[]) => {
            const newItems = update(this.state.todoItems, { $set: items });
            this.setState({ todoItems: newItems });
          });
      }
      else if (this.props.dataProvider.selectedList.Id === '0') {
        this._showPlaceHolder = true;
      }
    } else {
      this._showPlaceHolder = true;
    }
  }

  public componentDidMount() {
    if (!this._showPlaceHolder) {
      this.props.dataProvider.getItems().then(
        (items: ITodoItem[]) => {
          this.setState({ todoItems: items });
        });
    }
  }

  public render(): JSX.Element {
    if (this._showPlaceHolder && this.props.webPartDisplayMode === DisplayMode.Edit)
      return (
        <Fabric>

          <div>Edit mode</div>
        </Fabric>
      );
    else if (this._showPlaceHolder && this.props.webPartDisplayMode === DisplayMode.Read)
      return (
        <Fabric>

          <div>Read Mode. Configure the webpart</div>
        </Fabric>
      );
    else if (!this._showPlaceHolder)
      return (
        <Fabric>
          <div className={styles.todo}>
            <div className={styles.topRow}>
              <h2 className={styles.todoHeading}>Todo</h2>
            </div>
            <TodoForm onAddTodoItem={this._createTodoItem} />
            <TodoList items={this.state.todoItems}
              onCompleteTodoItem={this._completeTodoItem}
              onDeleteTodoItem={this._deleteTodoItem} />
          </div>
        </Fabric>
      );
  }



  private _configureWebPart(): void {
    this.props.configureStartCallback();
  }

  private _createTodoItem(inputValue: string): Promise<any> {
    return this.props.dataProvider.createItem(inputValue).then(
      (items: ITodoItem[]) => {
        const newItems = update(this.state.todoItems, { $set: items });
        this.setState({ todoItems: newItems });
      });
  }

  private _completeTodoItem(todoItem: ITodoItem): Promise<any> {
    return this.props.dataProvider.updateItem(todoItem).then(
      (items: ITodoItem[]) => {
        const newItems = update(this.state.todoItems, { $set: items });
        this.setState({ todoItems: newItems });
      });
  }

  private _deleteTodoItem(todoItem: ITodoItem): Promise<any> {
    return this.props.dataProvider.deleteItem(todoItem).then(
      (items: ITodoItem[]) => {
        const newItems = update(this.state.todoItems, { $set: items });
        this.setState({ todoItems: newItems });
      });
  }




}
