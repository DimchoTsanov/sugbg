import * as React from 'react';
import { Item } from '../common/ICommonObjects';
import TodoListItem from './TodoListItem';

export interface TodoListProps {
    items: Item[];
}

export default class TodoList extends 
React.Component<TodoListProps, void> {

    render() {
        return (
            <ul className="todoList" >
                {this.props.items.map(element => (
                    <TodoListItem item={element} key={element.id} />
                ))
                }
            </ul>
        );
    }
}