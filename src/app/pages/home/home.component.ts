import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { BookViewModel } from "../../utility/models/books/book.view.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  books: BookViewModel[] = [];
  showSpinner = true;

  constructor(
    private booksService: BooksService
  ) {
  }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.booksService.getAllBooks()
      .then((response: any) => {
        this.books = response;
        setTimeout(() => {
          this.books = this.books.sort((a: any, b: any) => (a.ratingAverage > b.ratingAverage ? -1 : 1));

          this.books = this.books.slice(0, 6);
          this.showSpinner = false;
        }, 200)
      })
  }

}
