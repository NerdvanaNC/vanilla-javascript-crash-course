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
    alertElement.innerText = alertContent;

    document.querySelector('#alerts').appendChild(alertElement);
    setTimeout(() => {alertElement.remove()}, 3000);
  }
}

// Storage Class: Handles Storage
class Storage {
  static addBook(book) { // uses ISBN as the primary key
    localStorage.setItem(`${book.isbn}`, JSON.stringify(book));
  }

  static deleteBook(isbn) {
    localStorage.removeItem(isbn);
  }

  static clearStorage() {
    localStorage.clear();
    location.reload();
  }

  static getAllBooks() {
    for(let i = 0; i < localStorage.length; i++) {
      let book = JSON.parse(localStorage.getItem(localStorage.key(i)));
      UI.addBook(book);
    }
  }
}

// Event: First Load
document.addEventListener('DOMContentLoaded', () => {
  Storage.getAllBooks();
});

// Event: Add Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  if(title == "" || author == "" || isbn == "") {
    UI.showAlert('warning', 'Please fill out all fields.');
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

// Event: Clear localStorage
document.querySelector('.clear-local-storage').addEventListener('click', () => { Storage.clearStorage(); });

// Event: Load Dummy Data
document.querySelector('.add-dummy-data').addEventListener('click', () => {
  if(confirm('This will reset all data.')) {
    Storage.clearStorage();

    const book1 = new Book('Book One', 'John Doe', '3465161984');
    const book2 = new Book('Book Two', 'Mary Smith', '4843516546');
    const book3 = new Book('Book Three', 'Janet Jackson', '5741068416');

    Storage.addBook(book1);
    Storage.addBook(book2);
    Storage.addBook(book3);

    UI.addBook(book1);
    UI.addBook(book2);
    UI.addBook(book3);
  }
});