import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, CircularProgress, Snackbar } from '@mui/material';
import { Book, LibraryBooks, AddCircleOutline } from '@mui/icons-material';

interface Book {
  id: bigint;
  title: string;
  author: string;
  rentedBy: [] | [string];
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const result = await backend.getBooks();
      setBooks(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const addBook = async () => {
    if (newBookTitle && newBookAuthor) {
      setLoading(true);
      try {
        await backend.addBook(newBookTitle, newBookAuthor);
        setNewBookTitle('');
        setNewBookAuthor('');
        await fetchBooks();
        showSnackbar('Book added successfully');
      } catch (error) {
        console.error('Error adding book:', error);
        showSnackbar('Error adding book');
      }
      setLoading(false);
    }
  };

  const rentBook = async (bookId: bigint) => {
    setLoading(true);
    try {
      const result = await backend.rentBook(bookId);
      if ('ok' in result) {
        await fetchBooks();
        showSnackbar('Book rented successfully');
      } else {
        showSnackbar(result.err);
      }
    } catch (error) {
      console.error('Error renting book:', error);
      showSnackbar('Error renting book');
    }
    setLoading(false);
  };

  const returnBook = async (bookId: bigint) => {
    setLoading(true);
    try {
      const result = await backend.returnBook(bookId);
      if ('ok' in result) {
        await fetchBooks();
        showSnackbar('Book returned successfully');
      } else {
        showSnackbar(result.err);
      }
    } catch (error) {
      console.error('Error returning book:', error);
      showSnackbar('Error returning book');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        <LibraryBooks /> Library App
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Available Books
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {books.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book.id.toString()}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{book.title}</Typography>
                      <Typography color="textSecondary">{book.author}</Typography>
                    </CardContent>
                    <CardActions>
                      {book.rentedBy.length === 0 ? (
                        <Button
                          startIcon={<Book />}
                          variant="contained"
                          color="primary"
                          onClick={() => rentBook(book.id)}
                        >
                          Rent
                        </Button>
                      ) : (
                        <Button
                          startIcon={<Book />}
                          variant="contained"
                          color="secondary"
                          onClick={() => returnBook(book.id)}
                        >
                          Return
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Add New Book
          </Typography>
          <form onSubmit={(e) => { e.preventDefault(); addBook(); }}>
            <TextField
              fullWidth
              label="Title"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Author"
              value={newBookAuthor}
              onChange={(e) => setNewBookAuthor(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutline />}
              disabled={loading}
            >
              Add Book
            </Button>
          </form>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default App;
