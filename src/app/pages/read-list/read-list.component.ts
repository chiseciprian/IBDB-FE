import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { Book } from "../../models/book";

@Component({
  selector: 'app-read-list',
  templateUrl: './read-list.component.html',
  styleUrls: ['./read-list.component.scss']
})
export class ReadListComponent implements OnInit {
  books: Book[] = [];

  constructor(private booksService: BooksService) {
  }

  ngOnInit(): void {
    this.getBooksAddedToReadList();
  }

  getBooksAddedToReadList() {
    this.booksService.getBooksAddedToReadList().subscribe((response) => {
      this.books = response;
    })
  }
}
