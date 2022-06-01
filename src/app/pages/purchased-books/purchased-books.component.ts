import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { BookViewModel } from "../../utility/models/books/book.view.model";

@Component({
  selector: 'app-purchased-books',
  templateUrl: './purchased-books.component.html',
  styleUrls: ['./purchased-books.component.scss']
})
export class PurchasedBooksComponent implements OnInit {

  books: BookViewModel[] = [];
  showSpinner = true;
  username: string = '';

  constructor(
    private booksService: BooksService
  ) {
  }

  ngOnInit(): void {
    this.initializeReadList();
  }

  initializeReadList() {
    this.getUsername()
    this.getPurchasedBooks(this.username);
  }

  getUsername() {
    this.username = AuthorizationServiceRepository.getCurrentUserValue().userName;
  }

  getPurchasedBooks(username: string) {
    this.booksService.getPurchasedBooks(username).then(
      (response) => {
        this.books = response;

        setTimeout(() => {
          this.showSpinner = false
        }, 200);
      }
    )
  }

}
