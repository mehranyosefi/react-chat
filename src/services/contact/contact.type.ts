export interface Contact{
 _id: string;
    owner: string;
    contact: {
        _id: string;
    };
    name: string;
    favorite: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ContactResponse{
    data:Contact
}

export interface ContactsResponse{
    data:Contact[]
}

export interface CreateContactPayload{
    email:string
    name:string
}

export interface UpdateContactPayload{
    name:string
}