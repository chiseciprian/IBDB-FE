import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
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
    private booksService: BooksService
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
    this.booksService.getBooksAddedToReadList(username).then(
      (response) => {
        this.books = response;

        setTimeout(() => {
          this.showSpinner = false
        }, 200);
      }
    )
  }

}
