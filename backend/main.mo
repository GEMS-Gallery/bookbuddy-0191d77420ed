import Array "mo:base/Array";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor Library {
  type Book = {
    id: Nat;
    title: Text;
    author: Text;
    rentedBy: ?Principal;
  };

  stable var nextBookId: Nat = 0;
  stable var booksEntries: [(Nat, Book)] = [];

  let books = HashMap.fromIter<Nat, Book>(booksEntries.vals(), 0, Nat.equal, Hash.hash);

  public query func getBooks(): async [Book] {
    Iter.toArray(books.vals())
  };

  public shared(msg) func addBook(title: Text, author: Text): async Nat {
    let bookId = nextBookId;
    nextBookId += 1;

    let newBook: Book = {
      id = bookId;
      title = title;
      author = author;
      rentedBy = null;
    };

    books.put(bookId, newBook);
    bookId
  };

  public shared(msg) func rentBook(bookId: Nat): async Result.Result<Text, Text> {
    switch (books.get(bookId)) {
      case (null) {
        #err("Book not found")
      };
      case (?book) {
        if (Option.isSome(book.rentedBy)) {
          #err("Book is already rented")
        } else {
          let updatedBook: Book = {
            id = book.id;
            title = book.title;
            author = book.author;
            rentedBy = ?msg.caller;
          };
          books.put(bookId, updatedBook);
          #ok("Book rented successfully")
        }
      };
    }
  };

  public shared(msg) func returnBook(bookId: Nat): async Result.Result<Text, Text> {
    switch (books.get(bookId)) {
      case (null) {
        #err("Book not found")
      };
      case (?book) {
        switch (book.rentedBy) {
          case (null) {
            #err("Book is not rented")
          };
          case (?renter) {
            if (renter == msg.caller) {
              let updatedBook: Book = {
                id = book.id;
                title = book.title;
                author = book.author;
                rentedBy = null;
              };
              books.put(bookId, updatedBook);
              #ok("Book returned successfully")
            } else {
              #err("You are not the renter of this book")
            }
          };
        }
      };
    }
  };

  system func preupgrade() {
    booksEntries := Iter.toArray(books.entries());
  };

  system func postupgrade() {
    booksEntries := [];
  };
}
