import { Component, OnInit } from '@angular/core';
import { BookModel } from "../../utility/models/books/book.model";
import { BooksService } from "../../services/books-service/books.service";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";

@Component({
  selector: 'app-purchased-books',
  templateUrl: './purchased-books.component.html',
  styleUrls: ['./purchased-books.component.scss']
})
export class PurchasedBooksComponent implements OnInit {

  books: BookModel[] = [];
  showSpinner = true;
  username: string = '';

  constructor(
    private booksService: BooksService
  ) {
  }

  ngOnInit(): void {
    this.initializeReadList();
  }

  getPurchasedBooks(username: string) {
    this.booksService.getPurchasedBooks(username).subscribe((response) => {
      this.books = response;
      setTimeout(() => {
        this.showSpinner = false
      }, 200);
    })
  }

  getUsername() {
    this.username = AuthorizationServiceRepository.getCurrentUserValue().userName;
  }

  async initializeReadList() {
    this.getUsername()
    this.getPurchasedBooks(this.username);
  }

}
