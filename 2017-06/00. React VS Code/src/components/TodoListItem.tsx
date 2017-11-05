import * as React from 'react';
import { Item } from '../common/ICommonObjects';

export interface TodoListItemProps {
    item: Item;
}

export default class TodoListItem extends React.Component<TodoListItemProps, {}> {

    render() {
        console.log(this.props.item.id);

        return (
            <li className="todoListItem" key={this.props.item.id}>{this.props.item.text}</li>
        )
    }
}