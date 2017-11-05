import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'documentsReactStrings';
import DocumentsReact from './components/DocumentsReact';
import { IDocumentsReactProps } from './components/IDocumentsReactProps';
import { IDocumentsReactWebPartProps } from './IDocumentsReactWebPartProps';

import IDocsDataProvider from "../../dataProviders/ITodoDataProvider";
import MockDataProvider from "../../dataProviders/MockDataProvider";
import SharePointDataProvider from "../../dataProviders/SharePointDataProvider";


export default class DocumentsReactWebPart extends BaseClientSideWebPart<IDocumentsReactWebPartProps> {

  private _dataProvider: IDocsDataProvider;

  protected onInit(): Promise<void> {

    this.context.statusRenderer.displayLoadingIndicator(this.domElement, "settings");

    debugger;
    if (DEBUG && Environment.type === EnvironmentType.Local) {
      this._dataProvider = new MockDataProvider();
      this._dataProvider.webPartContext = this.context;

    } else {
      this._dataProvider = new SharePointDataProvider();
      this._dataProvider.webPartContext = this.context;
    }

    this._openPropertyPane = this._openPropertyPane.bind(this);

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IDocumentsReactProps> = React.createElement(
      DocumentsReact,
      {
        dataProvider: this._dataProvider,
        webPartDisplayMode: this.displayMode,
        configureStartCallback: this._openPropertyPane
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
  private _openPropertyPane(): void {

    this.context.propertyPane.open();
  }
}
