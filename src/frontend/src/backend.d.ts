import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Member {
    id: string;
    assemblyId: string;
    memberId: string;
    name: string;
    createdAt: Time;
    districtId: string;
    address: string;
    unionId: string;
    mobile: string;
}
export interface DropdownOption {
    id: string;
    text: string;
    category: string;
}
export type Time = bigint;
export interface backendInterface {
    addDropdownOption(text: string, category: string): Promise<DropdownOption>;
    addMember(name: string, mobile: string, address: string, districtId: string, unionId: string, assemblyId: string, memberId: string): Promise<Member>;
    deleteDropdownOption(id: string): Promise<boolean>;
    getDropdownOptions(category: string): Promise<Array<DropdownOption>>;
    getMembers(): Promise<Array<Member>>;
    searchMembers(searchQuery: string, field: string): Promise<Array<Member>>;
    seedInitialData(): Promise<void>;
    updateDropdownOption(id: string, text: string): Promise<DropdownOption | null>;
}
