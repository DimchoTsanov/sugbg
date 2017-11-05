export interface ILink {

    Name: string;
    AccountID: string;
    AccountingType: string;
    AccountName: string;
    AccountShortName: string;
    ClientType: string;
}


export interface IDoc {

    Id: number;
    Name?: string;
    Modified?: any;
    ModifiedBy?: any;
    FileIcon?: string;
    FileRef?: string;
    ListItemEntityTypeFullName?: string;

}

export interface ISPUser {
    UserId: number;
    PersonaName?: string;
    ImageUrl?: string;
}

export interface IBillingDoc {

    Id?: number;
    Name?: string;
    Modified?: any;
    ModifiedBy?: any;
    FileIcon?: string;
    FileRef?: string;

}