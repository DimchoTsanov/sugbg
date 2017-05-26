import * as $ from "jquery";
//import $ = require("jquery");
//window.$ = window.jQuery = require("jquery");

import * as React from 'react';
//import * as $ from "jquery";

declare var _spPageContextInfo: any;

import {
    Nav,
    INavLink,
    INavLinkGroup,
    INavProps,
    INavState
} from 'office-ui-fabric-react/lib/Nav';

export class MyGroup implements INavLinkGroup {

    links: INavLink[];

    constructor() {
        this.links =
            [
                {
                    name: 'All Clients',
                    url: '/sites/Development/Pages/Clients.aspx',
                    isExpanded: true
                },
                {
                    name: 'My Clients',
                    url: '',
                    isExpanded: true
                },
                {
                    name: 'Banking Resources',
                    url: '',
                    links: [{
                        name: 'Add New Client',
                        url: '',
                        key: 'key4'
                    },
                    {
                        name: 'Client Checklist',
                        url: '',
                        key: 'key5'
                    },
                    {
                        name: 'Central BankoDocuments',
                        url: '',
                        key: 'key7'
                    },
                    {
                        name: '2017 All Files',
                        url: '',
                        key: 'key8'
                    },
                    {
                        name: '2017 Favorited Files',
                        url: '',
                        key: 'key9'
                    }],
                    isExpanded: true
                }
            ]
    }

}

export interface NavBasicExampleState {
    items: INavLink[];
}


export class NavBasicExample extends React.Component<any, NavBasicExampleState> {

    private _group: MyGroup;

    constructor(props: INavProps) {
        super(props);
        this._onClickHandler = this._onClickHandler.bind(this);
        this._group = new MyGroup();

        //this.setState({items: this._group.links});
        this.state = { items: this._group.links };
    }


    public render() {
        return (
            <div className='ms-NavExample-LeftPane'>
                <Nav groups={[this._group]} />
            </div>
        );
    }

    public componentDidMount() {

        try {
            let siteAbsoluteUrl: string = _spPageContextInfo.siteAbsoluteUrl; //replace 
            if (window.location.href.toLowerCase().indexOf("/sites/Development/Pages/Clients.aspx".toLowerCase()) > -1) {

                let clients2: INavLink[] = [];

                var link: INavLink = { name: "", url: "" };
                link.name = "[.....]";
                link.url = "";
                clients2.push(link);

                this._group.links[1].links = clients2;
                this.setState({ items: this._group.links });
            }
            else {

                //1. AJAX call to get the userID
                $.ajax({
                    url: siteAbsoluteUrl + "/_api/web/currentuser/",
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    dataType: "json",
                    success: function (data) {

                        if (data.d) {
                            console.log("current user Id: " + data.d.Id);
                            $.ajax({
                                // call to Followed list 
                                // the hardcoded ID is of the list FollowedClients 
                                url: siteAbsoluteUrl + "/_api/web/Lists(guid'473DE466-3153-4696-9C36-EB5933E60FF8')/items?$filter=(PragerUser eq " + data.d.Id + ")",
                                method: "GET",
                                headers: { "Accept": "application/json; odata=verbose" },
                                success: function (data) {
                                    console.log("folloed clients item loaded")
                                    if (data.d && data.d.results && data.d.results.length > 0) {
                                        if (data.d.results.length == 0) {
                                            console.log("no followed clients");
                                        }
                                        else if (data.d.results.length > 1) {
                                            //logical error - only one item per user
                                            console.log("logical error - only one item per user");
                                        }
                                        else {
                                            console.log("current user has followed clients ");
                                            let lookupItems = data.d.results[0].PragerClientsId;

                                            let itemsQuery: string = lookupItems.results.map(
                                                function (item) {
                                                    return "(ID eq " + item + " )"
                                                }).join(" or ");

                                            // the hardcoded ID is of the list Clients (/Lists/Accounts) 
                                            $.ajax({
                                                url: siteAbsoluteUrl + "/_api/web/Lists(guid'92858E97-EC55-4F25-9DF2-E3295100276E')/items?$filter=(" + itemsQuery + ")",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    if (data.d && data.d.results && data.d.results.length > 0) {
                                                        console.log("current user followed clients");


                                                        let clients2: INavLink[] = [];
                                                        for (let i: number = 0; i < data.d.results.length; i++) {
                                                            var item: any = data.d.results[i];
                                                            var link: INavLink = { name: "", url: "" };
                                                            link.name = item.AccountName;
                                                            link.url = "/sites/Development/Banking/Pages/Client.aspx?ShortName=" + item.AccountShortName +
                                                                "&ItemId=" + item.Id + "&Name=" + encodeURIComponent(item.AccountName);
                                                            clients2.push(link);

                                                        }

                                                        this._group.links[1].links = clients2;
                                                        this.setState({ items: this._group.links });

                                                    }
                                                    else {

                                                        console.log("no follwoed clients ");
                                                    }
                                                }.bind(this), // !!! this is needed because of the this.setState
                                                error: function (data) {
                                                    console.log("Error: " + data);
                                                }

                                            });

                                        }

                                    }
                                }.bind(this), // !!! this is needed because of the this.setState
                                error: function (data) {
                                    console.log("Error: " + data);
                                }
                            });
                        }
                    }.bind(this),
                    error: function (data) {
                        console.log("Error: " + data);
                    }
                });


                // let siteAbsoluteUrl: string = _spPageContextInfo.siteAbsoluteUrl; //replace 
                // $.ajax({
                //     url: siteAbsoluteUrl + "/_api/web/currentuser/",
                //     method: "GET",
                //     headers: { Accept: "application/json; odata=verbose" }
                // }).then((response: any) => { //.then((response: Responce) => {
                //     //2.  AJAX call to get item per user, read multi lookup column
                //     //3.  AJAX call to get related Clients 
                //     console.log(response.json());

                // }, function (reason) {
                //     console.log(reason); // rejection
                // });


                // method: "GET",
                // headers: { "Accept": "application/json; odata=verbose" }
            }


        }
        catch (ex) {
            console.log("Error: " + ex);
            //ToDo: notify the user
        }

        // setTimeout(() => {
        //     let clients = [
        //         {
        //             name: 'Duke University 1',
        //             url: '#',
        //             key: 'key1'
        //         },
        //         {
        //             name: 'Chicago 123',
        //             url: '#',
        //             key: 'key2'
        //         },
        //         {
        //             name: 'Cincinnati',
        //             url: '#',
        //             key: 'key3'
        //         }];

        //     this._group.links[0].links = clients;
        //     this.setState({ items: this._group.links });

        // }, 3000);
    }

    private _onClickHandler(e: React.MouseEvent<HTMLElement>) {

        alert('test');

        return false;
    }

    private _onClickHandler2(e: React.MouseEvent<HTMLElement>) {
        return false;
    }
}