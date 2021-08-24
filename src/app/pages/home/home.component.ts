import {Component, OnInit} from '@angular/core';
import {BooksService} from "../../services/books-service/books.service";
import {Book} from "../../models/Book";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  books: Book[] = [];

  constructor(
    private booksService: BooksService
  ) {
  }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.booksService.getAllBooks().subscribe((response) => {
      this.books = response.slice(0, 6);
      this.books.sort((a, b) => (a.ratingAverage > b.ratingAverage) ? -1 : 1);
    })
  }
}
