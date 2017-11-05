import * as React from 'react';
import styles from './DocumentsReact.module.scss';
import {
  Link, MarqueeSelection, DetailsList, Selection, Image,
  ImageFit, SelectionMode, Spinner, SpinnerSize, Fabric, IColumn, ColumnActionsMode,
  CheckboxVisibility, Callout
} from 'office-ui-fabric-react';
import * as _ from "lodash";
import { DisplayMode } from '@microsoft/sp-core-library';
import { Placeholder } from '@microsoft/sp-webpart-base';

import { IDocumentsReactProps } from './IDocumentsReactProps';
import IDocumentsReactState from './IDocumentsReactState';
import { IBillingDoc } from '../../../common/ICommonObjects';



export default class DocumentsReact extends React.Component<IDocumentsReactProps, IDocumentsReactState> {

  private _selection: Selection;
  private _showPlaceHolder: boolean = true;

  private _calloutButtonElement: HTMLElement;

  constructor(props: IDocumentsReactProps) {
    super(props);

    if (this.props.dataProvider) {

      this._showPlaceHolder = false;

    } else {

      this._showPlaceHolder = true;
    }

    this.state = {
      documents: [],
      isLoading: true,
      columns: this._setupColumns(),
      isCalloutVisible: false
    };

    this._renderItemColumn = this._renderItemColumn.bind(this);
    this._onShowMenuClicked = this._onShowMenuClicked.bind(this);
    this._onCalloutDismiss = this._onCalloutDismiss.bind(this);

  }

  public render(): React.ReactElement<IDocumentsReactProps> {

    if (this._showPlaceHolder && this.props.webPartDisplayMode === DisplayMode.Edit) {
      return (
        <div>
          <Fabric>
            <Placeholder
              icon={'ms-Icon--Edit'}
              iconText='Documents'
              description='WebPart is not configured'
            /* buttonLabel='Configure'
           onAdd={this._configureWebPart}*/
            />
          </Fabric>
        </div>);
    }
    if (this._showPlaceHolder && this.props.webPartDisplayMode === DisplayMode.Read) {
      return (
        <div>
          <Fabric>
            <Placeholder
              icon={'ms-Icon--Edit'}
              iconText='Documents'
              description='Missing Client ShortName parameter... ' />
          </Fabric>
        </div>);
    }
    if (!this._showPlaceHolder) {
      const loading = this.state.isLoading;
      if (loading) {
        // SpinnerSize is undefine in https://localhost:4321
        // temporary add this check
        if (SpinnerSize && SpinnerSize.large) {
          return (<div className={styles.loadingWrapper}>
            <Spinner size={SpinnerSize.large} label='Loading documents...' />
          </div>);
        }

        return (<div className={styles.loadingWrapper}>
          <Spinner label='Loading documents...' />
        </div>);
      }

      return (
        <div>
          <div className={styles.header}>
            <span className={styles.headerText}>Documents</span>
            <div className={styles.headerInfo}>
              <i className="ms-Icon ms-Icon--Info"
                aria-hidden="false"
                role="button"
                onClick={this._onShowMenuClicked}
                ref={(calloutButton) => this._calloutButtonElement = calloutButton}>

              </i>
              {this.state.isCalloutVisible && (
                <Callout
                  className={styles.calloutWrapper}
                  gapSpace={0}
                  targetElement={this._calloutButtonElement}
                  onDismiss={this._onCalloutDismiss}
                  setInitialFocus={true}>
                  <div className={styles.calloutHeader}>
                    <p className={styles.calloutTitle}>
                      Displaying {this.state.documents ? this.state.documents.length : 0} documents...
                      </p>
                  </div>
                  <div className={styles.calloutInner}>
                    <p className={styles.calloutSubText}>
                      Documents ordered descending by their XX column.
                      </p>
                  </div>
                </Callout>
              )}
            </div>
          </div>
          <div className={styles.wrapper} >
            <MarqueeSelection selection={this._selection}>
              <DetailsList
                columns={this.state.columns}
                items={this.state.documents}
                onColumnHeaderClick={this._onHeaderColumnClick.bind(this)}
                onItemInvoked={(item) => { this._openDocument(item.FileRef); }}
                selectionPreservedOnEmptyClick={true}
                onRenderItemColumn={this._renderItemColumn}
                checkboxVisibility={CheckboxVisibility.hidden}
              />
            </MarqueeSelection>
          </div>
        </div>);
    }

  }

  public componentDidMount() {

    debugger;
    if (!this._showPlaceHolder) {
      this.props.dataProvider.readBillingDocsForClient().then(
        (items: IBillingDoc[]) => {
          debugger;

          this.setState({ documents: items, isLoading: false, columns: this.state.columns });

        });
    }
  }


  private _renderItemColumn(item, index, column) {
    let fieldContent = item[column.fieldName];

    switch (column.key) {
      case 'FileIcon':
        return <Image src={fieldContent} width={16} height={16} imageFit={ImageFit.center} />;
      case 'Name':
        return <Link data-selection-invoke={true} >{item[column.key]}</Link>;
      default:
        return <span>{fieldContent}</span>;
    }
  }

  private _openDocument(fileRef: string): void {

    window.open(window.location.origin + fileRef + "?web=1");

  }

  private _configureWebPart(): void {
    this.props.configureStartCallback();
  }

  private _setupColumns(): IColumn[] {
    const columns1: IColumn[] =
      [
        {
          key: 'FileIcon',
          name: '',
          fieldName: 'FileIcon',
          minWidth: 20,
          maxWidth: 20,
          isResizable: true
        },
        {
          key: 'Name',
          name: 'Name',
          fieldName: 'Name',
          minWidth: 100,
          maxWidth: 300,
          isResizable: false,
          isSorted: false,
          isSortedDescending: false,
          columnActionsMode: ColumnActionsMode.hasDropdown

        },
        {
          key: 'Modified',
          name: 'Modified',
          fieldName: 'Modified',
          minWidth: 140,
          isResizable: false,
          isSorted: false,
          isSortedDescending: false,
          columnActionsMode: ColumnActionsMode.hasDropdown
        },
        {
          key: 'ModifiedBy',
          name: 'Modified By',
          fieldName: 'ModifiedBy',
          minWidth: 140,
          isResizable: false,
          isSorted: false,
          isSortedDescending: false,
          columnActionsMode: ColumnActionsMode.hasDropdown
        },
      ];

    const columns: IColumn[] =
      [{
        key: 'FileIcon',
        name: '',
        fieldName: 'FileIcon',
        minWidth: 20,
        maxWidth: 20,
        isResizable: true
      },
      {
        key: 'Name',
        name: 'Name',
        fieldName: 'Name',
        minWidth: 100,
        maxWidth: 300,
        isResizable: false,
        isSorted: false,
        isSortedDescending: false,
        columnActionsMode: ColumnActionsMode.hasDropdown

      }
      ];

    return columns1;
  }

  /**
 * Sorts a column when the user clicks on the header
 *
 * @private
 * @param {*} event
 * @param {IColumn} column
 *
 * @memberOf PropertyBagDisplay
 */
  private _onHeaderColumnClick(event: any, column: IColumn) {
    // find the clicked column in the state
    column = _.find(this.state.columns, c => c.fieldName === column.fieldName);
    // If we've sorted this column, flip it.
    if (column.isSorted) {
      column.isSortedDescending = !column.isSortedDescending;
    }
    else {
      column.isSorted = true;
      column.isSortedDescending = false;
    }

    //reset the other columns
    _.map(this.state.columns, (c: IColumn) => {
      if (c.fieldName != column.fieldName) {
        c.isSorted = false;
        c.isSortedDescending = false;
      }
    });

    // sort the documents array (stored in the state)
    this.state.documents = _.orderBy(
      this.state.documents,
      [(document, x, y, z) => {
        if (document[column.fieldName]) {
          return document[column.fieldName].toLowerCase();
        }
        else {
          return "";
        }
      }],
      [column.isSortedDescending ? "desc" : "asc"]);


    this.setState(this.state);
  }

  private _onShowMenuClicked() {
    this.setState({
      isCalloutVisible: !this.state.isCalloutVisible
    });
  }

  private _onCalloutDismiss() {
    this.setState({
      isCalloutVisible: false
    });
  }
}
