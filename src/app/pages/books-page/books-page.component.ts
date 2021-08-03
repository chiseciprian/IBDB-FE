import {Component, OnInit} from '@angular/core';
import {BooksService} from "../../services/books.service";
import {Book} from "../../models/Book";

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss']
})
export class BooksPageComponent implements OnInit {
  books: Book[] = [];

  constructor(private booksService: BooksService) {
  }

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks() {
    this.booksService.getAllBooks().subscribe((response) => {
      this.books = response;
    })
  }
}
