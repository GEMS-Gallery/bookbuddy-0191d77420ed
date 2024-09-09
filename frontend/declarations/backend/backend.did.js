export const idlFactory = ({ IDL }) => {
  const Book = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'author' : IDL.Text,
    'rentedBy' : IDL.Opt(IDL.Principal),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'addBook' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'getBooks' : IDL.Func([], [IDL.Vec(Book)], ['query']),
    'rentBook' : IDL.Func([IDL.Nat], [Result], []),
    'returnBook' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
