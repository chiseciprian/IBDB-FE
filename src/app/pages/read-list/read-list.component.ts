import {Component, OnInit} from '@angular/core';
import {BooksService} from "../../services/books-service/books.service";
import {Book} from "../../models/book";

@Component({
  selector: 'app-read-list',
  templateUrl: './read-list.component.html',
  styleUrls: ['./read-list.component.scss']
})
export class ReadListComponent implements OnInit {
  books: Book[] = [];
  showSpinner=true;

  constructor(private booksService: BooksService) {
  }

  ngOnInit(): void {
    this.getBooksAddedToReadList();
  }

  getBooksAddedToReadList() {
    this.booksService.getBooksAddedToReadList().subscribe((response) => {
      this.books = response;
      setTimeout(() => {
        this.showSpinner = false
      }, 200);
    })
  }
}
