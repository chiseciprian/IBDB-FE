import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { RatingsService } from "../../services/ratings-service/ratings.service";
import { BookViewModel } from "../../utility/models/books/book.view.model";

@Component({
  selector: 'app-read-list',
  templateUrl: './read-list.component.html',
  styleUrls: ['./read-list.component.scss']
})
export class ReadListComponent implements OnInit {
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
    this.getBooksAddedToReadList(this.username);
  }

  getUsername() {
    this.username = AuthorizationServiceRepository.getCurrentUserValue().userName;
  }

  getBooksAddedToReadList(username: string) {
    this.booksService.getBooksAddedToReadList(username).subscribe((response: any) => {
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
}
