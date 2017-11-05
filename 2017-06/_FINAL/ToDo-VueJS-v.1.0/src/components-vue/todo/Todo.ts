import * as Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import TodoItem from '../todo-item/Todoitem.vue';
import { ITodoProps2 } from './ITodoProps';
import ITodoDataProvider from '../../dataProviders/ITodoDataProvider';
import { DisplayMode } from '@microsoft/sp-core-library';
import ITodoItem from '../../common/models/ITodoItem';

@Component({
  components: {
    'todo-item': TodoItem
  }
})
export default class Todo extends Vue implements ITodoProps2 {
  debugger;
  @Prop
  public dataProvider: ITodoDataProvider;
  @Prop
  public webPartDisplayMode: DisplayMode;

  public mytodos: string[] = [];
  public todoTitle: string = '';

  public addTodo(): void {
    debugger;
    if (!this.todoTitle) {
      return;
    }

    this.mytodos.unshift(this.todoTitle);
    this.todoTitle = '';
  }

  public completed(todo: string): void {
    debugger;
    const index: number = this.mytodos.indexOf(todo, 0);
    if (index > -1) {
      this.mytodos.splice(index, 1);
    }
  }

  public created(): void {
    debugger;
    if (this.dataProvider.selectedList) {
      if (this.dataProvider.selectedList.Id !== '0') {

        this.dataProvider.getItems().then(
          (results: ITodoItem[]) => {
            debugger;
            let items: string[] = results.map((item: ITodoItem) => {
              return item.Title;
            })

            this.mytodos = items;

          });
      }
    }

  }
}