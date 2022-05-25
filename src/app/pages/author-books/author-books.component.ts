import { Component, OnInit } from '@angular/core';
import { BookViewModel } from "../../utility/models/books/book.view.model";
import { BooksService } from "../../services/books-service/books.service";
import { RatingsService } from "../../services/ratings-service/ratings.service";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";

@Component({
  selector: 'app-author-books',
  templateUrl: './author-books.component.html',
  styleUrls: ['./author-books.component.scss']
})
export class AuthorBooksComponent implements OnInit {
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

  getBooksByAuthorUsername(username: string) {
    this.booksService.getBooksByAuthorUsername(username).subscribe((response: any) => {
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

        if (book.fileId) {
          this.booksService.getBookFile(book.fileId).subscribe((response) => {
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

  getUsername() {
    this.username = AuthorizationServiceRepository.getCurrentUserValue().userName;
  }

  async initializeReadList() {
    this.getUsername()
    this.getBooksByAuthorUsername(this.username);
  }
}
