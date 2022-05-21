import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { BookModel } from "../../utility/models/books/book.model";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";

@Component({
  selector: 'app-read-list',
  templateUrl: './read-list.component.html',
  styleUrls: ['./read-list.component.scss']
})
export class ReadListComponent implements OnInit {
  books: BookModel[] = [];
  showSpinner = true;
  username: string = '';

  constructor(
    private booksService: BooksService
  ) {
  }

  ngOnInit(): void {
    this.initializeReadList();
  }

  getBooksAddedToReadList(username: string) {
    this.booksService.getBooksAddedToReadList(username).subscribe((response) => {
      this.books = response;
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
    this.getBooksAddedToReadList(this.username);
  }
}
