// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn // primary key
  }
}

// UI Class: Handle UI Tasks
class UI { // static class; never instantiated
  static addBook(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.setAttribute('data-isbn', book.isbn);    
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a class="btn btn-danger btn-sm delete" data-isbn="${book.isbn}">
        X
      </a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(isbn) {
    document.querySelector(`tr[data-isbn="${isbn}"`).remove();
  }

  static clearFields() {
    document.querySelectorAll('#book-form input[type="text"]').forEach((field) => {
      field.value = '';
    });
  }

  static showAlert(alertType = 'info', alertContent = 'This is an alert!') {
    const acceptableAlertClasses = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    const alertClass = acceptableAlertClasses.includes(alertType) ? alertType : 'info';

    const alertElement = document.createElement('div');
    alertElement.className += 'm-0 alert alert-' + alertClass;
    alertElement.setAttribute('role', 'alert');
    alertElement.appendChild(document.createTextNode(alertContent));

    document.querySelector('#alerts').appendChild(alertElement);
    setTimeout(() => {alertElement.remove()}, 3000);
  }
}

// Storage Class: Handles Storage
class Storage {
  static addBook(book) { // uses ISBN as the primary key
    let books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : {};
    books[book.isbn] = book;
    localStorage.setItem('books', JSON.stringify(books));
  }

  static deleteBook(isbn) {
    let books = JSON.parse(localStorage.getItem('books'));
    delete books[isbn];
    localStorage.setItem('books', JSON.stringify(books));
  }

  static checkBookExists(isbn) {
    let books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : {};
    return isbn in books;
  }

  static getAllBooks() {
    return localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : {};
  }
}

// Event: First Load
document.addEventListener('DOMContentLoaded', () => {
  let books = Storage.getAllBooks();
  for(book in books) {
    UI.addBook(books[book]);
  }
});

// Event: Add Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  if(title == "" || author == "" || isbn == "") {
    UI.showAlert('warning', 'Please fill out all fields.');
  } else if(isbn.length > 10) {
    UI.showAlert('warning', 'ISBN should be 10 numbers.');
  } else if(Storage.checkBookExists(isbn)) {
    UI.showAlert('warning', 'That ISBN already exists.');
  } else {
    const book = new Book(title, author, isbn);

    Storage.addBook(book);
    UI.addBook(book);
    UI.clearFields();
    UI.showAlert('success', 'Book Added');
  }  
});

// Event: Delete Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  if(e.target.classList.contains('delete')) {
    const isbn = e.target.dataset.isbn;
    Storage.deleteBook(isbn);
    UI.deleteBook(isbn);
    UI.showAlert('danger', 'Book Removed');
  }
});