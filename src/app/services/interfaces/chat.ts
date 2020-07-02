export interface Chat {
    id?: string;
    lastMessage?: string;
    lastDate?: any;
    unread?: boolean | object;
    name?: string;
    createdBy?: string;
    createdAt?: any;
    members?: string[];
}
