import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Book {
  'id' : bigint,
  'title' : string,
  'author' : string,
  'rentedBy' : [] | [Principal],
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'addBook' : ActorMethod<[string, string], bigint>,
  'getBooks' : ActorMethod<[], Array<Book>>,
  'rentBook' : ActorMethod<[bigint], Result>,
  'returnBook' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
