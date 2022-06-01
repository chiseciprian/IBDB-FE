import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { BookViewModel } from "../../utility/models/books/book.view.model";
import { RatingsService } from "../../services/ratings-service/ratings.service";

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
    private booksService: BooksService,
    private ratingService: RatingsService
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
    this.booksService.getPurchasedBooks(username).subscribe((response: any) => {
      this.books = response;
      this.books.map((book) => {
        this.ratingService.getRatingAverage(book.bookId).subscribe(average => {
          book.ratingAverage = average;
        });

        if (book.coverId) {
          this.booksService.getCover(book.coverId).subscribe((response) => {
            book.cover = response.image.data;
          })
        }

        if (book.bookText) {
          this.booksService.getBookFile(book.bookText).subscribe((response) => {
            book.file = response.bookFile.data;
          })
        }

        return book;
      })
      setTimeout(() => {
        this.showSpinner = false
      }, 200);
    })
  }

}
