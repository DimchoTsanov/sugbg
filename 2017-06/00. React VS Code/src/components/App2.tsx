import * as React from 'react';
import { Item } from '../common/ICommonObjects';
import TodoList from './TodoList';

export interface ITodoAppProps {
  items?: Item[];
}

export interface ITodoAppState {
  items: Item[];
  text: string;
}

export default class TodoApp2 extends React.Component<ITodoAppProps, ITodoAppState> {

  constructor(props) {

    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


    let initialItems: Item[] =
      props.items && props.items.length > 0 ? props.items : [];
    this.state = { items: initialItems, text: '' };
  }

  render() {
    return (
      <div className="todoWrapper">
        <h3>TodoApp2</h3>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange} value={this.state.text} />
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>
        <ul className="todoList">
          {
            this.state.items.map(element => (
              <li className="todoListItem" key={element.id}>{element.text}</li>
            ))
          }
        </ul>
      </div>
    );
  }

  // helper methods
  handleChange(e) {
    console.log('handleChange');
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    console.log('handleSubmit');
    e.preventDefault();

    var newItem: Item = {
      id: Date.now(),
      text: this.state.text,
    };
    this.setState((prevState) => ({
      items: prevState.items.concat(newItem),
      text: ''
    }));
  }
}