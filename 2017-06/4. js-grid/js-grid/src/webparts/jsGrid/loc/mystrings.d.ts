declare interface IJsGridStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'jsGridStrings' {
  const strings: IJsGridStrings;
  export = strings;
}
