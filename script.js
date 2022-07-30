// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn
  }
}

// UI Class: Handle UI Tasks
class UI { // static class; never instantiated
  static displayBooks() {
    // Sample
    const StoredBooks = [
      {
        title: 'Book One',
        author: 'John Doe',
        isbn: '3465161984'
      },
      {
        title: 'Book Two',
        author: 'Mary Smith',
        isbn: '48435165464'
      }
    ];

    const books = StoredBooks;

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a class="btn btn-danger btn-sm delete">
        X
      </a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(eventTarget) {
    eventTarget.parentElement.parentElement.remove(); // this feels hacky
  }

  static clearFields() {
    document.querySelectorAll('#book-form input[type="text"]').forEach((field) => {
      field.value = '';
    });
  }
}

// Store Class: Handles Storage

// Event: Display Books
document.addEventListener('DOMContentLoad', UI.displayBooks());

// Event: Add Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  UI.addBookToList(new Book(title, author, isbn));
  UI.clearFields();
});

// Event: Delete Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  if(e.target.classList.contains('delete')) {
    UI.deleteBook(e.target);
  }
});