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

        return book;
      })

      setTimeout(() => {
        this.books = this.books.sort((a: any, b: any) => (a.ratingAverage > b.ratingAverage ? -1 : 1));

        this.books = this.books.slice(0, 6);
        this.showSpinner = false;
      }, 400)
    })
  }


}
