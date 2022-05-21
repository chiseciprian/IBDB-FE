import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { BookViewModel } from "../../utility/models/books/book.view.model";
import { RatingsService } from "../../services/ratings-service/ratings.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  books: BookViewModel[] = [];
  showSpinner = true;

  constructor(
    private booksService: BooksService,
    private ratingService: RatingsService
  ) {
  }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.booksService.getAllBooks().subscribe((response: any) => {
      setTimeout(() => {
        this.books = response.sort((a: any, b: any) => (a.ratingAverage > b.ratingAverage ? -1 : 1));

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


        this.books = this.books.slice(0, 6);
        this.showSpinner = false;
      }, 400)
    })
  }


}
