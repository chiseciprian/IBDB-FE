import {Component, OnInit} from '@angular/core';
import {BooksService} from "../../services/books-service/books.service";
import {BookModel} from "../../utility/models/books/book.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  books: BookModel[] = [];
  showSpinner = true;

  constructor(
    private booksService: BooksService
  ) {
  }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.booksService.getAllBooks().subscribe((response) => {
      setTimeout(() => {
        this.books = response.sort((a, b) => (a.ratingAverage > b.ratingAverage ? -1 : 1));

        this.books = this.books.slice(0, 6);
        this.showSpinner = false;
      }, 400)
    })
  }


}
