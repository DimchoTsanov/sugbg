import * as React from 'react';
import { IGridProps } from './IGridProps';
import IGridState from './IGridState';
import { IDoc } from '../../common/ICommonObjects';
//import update from 'immutability-helper';
import update = require('immutability-helper');

export default class ReactGrid extends React.Component<IGridProps, IGridState> {

  constructor(props: IGridProps) {
    super(props);

    this.state = {
      documents: [],
      isLoading: true,
    };

    this._editDocument1 = this._editDocument1.bind(this);
  }

  public render(): React.ReactElement<IGridProps> {
    if (this.state.isLoading) {
      // presentation
      return (
        <div>
          Loading data...
      </div>);
    }
    else {
      //business logic 
      let docsList = [];
      if (this.state.documents) {
        //example 1
        /*docsList = this.state.documents.map(function (item) {
          return <li key={item.Id.toString()}
            className="listItem">{item.Name}</li>;
        })*/

        //example 2

        let call = this._editDocument1.bind(this);
        docsList = this.state.documents.map(function (item) {
          return <li key={item.Id.toString()}
            className="listItem">
            <a href="javascript:void(0)"
              onClick={(test: any) => { call(item) }}
            >
              {item.Name}</a>
          </li >;
        })



      }
      let totalCount = this.state.documents ? this.state.documents.length : 0;
      // presentation logic
      return (
        <div>
          <div>
            total documents: {totalCount}
          </div>
          <ul>{docsList}</ul>
        </div>
      );
    }
  }

  public componentDidMount() {

    console.log("componentDidMount");
    debugger;
    this.props.dataProvider.readDocsFromLibrary().then(
      (result: IDoc[]) => {
        debugger;
        this.setState({
          documents: result,
          isLoading: false,
        });
      });
  }

  private _editDocument(event: any, a: any): void {
    event.preventDefault()
    debugger;
    var el = event.target
    console.log(el);
  }

  private _editDocument1(doc: IDoc): void {
    event.preventDefault()
    debugger;

    if (confirm("Do you want to edit " + doc.Name) == true) {

      this.props.dataProvider.editDoc(doc).then((result: IDoc) => {
        debugger;

        var updatedDoc: IDoc = result;
        if (updatedDoc) {
          let indexOfUpdatedItem = -1;

          for (var i = 0; i < this.state.documents.length; i++) {
            if (this.state.documents[i].Id == updatedDoc.Id) {
              indexOfUpdatedItem = i;
              break;
            }
          }
          if (indexOfUpdatedItem > -1) {

            const newItems = update(this.state.documents,
              {
                [indexOfUpdatedItem]: {  //ES6 computed property names; if the indexOfUpdatedItem is not pass as array, the value is treated as the string "indexOfUpdatedItem"
                  Name:
                  { $set: updatedDoc.Name },

                }
              });

            this.setState({ documents: newItems, isLoading: false });
          }
        }
        else {
          //do nothing - no changed element in the state collection
        }
      });

    }
  }

}