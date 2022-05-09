import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { Book } from "../../models/book";
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: 'app-read-list',
  templateUrl: './read-list.component.html',
  styleUrls: ['./read-list.component.scss']
})
export class ReadListComponent implements OnInit {
  books: Book[] = [];
  showSpinner = true;
  username: string = '';

  constructor(
    private booksService: BooksService,
    private keycloakService: KeycloakService
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

  async getUsername() {
    await this.keycloakService.isLoggedIn().then(
      () => {
        this.username = this.keycloakService.getUsername();
      }
    )
  }

  async initializeReadList() {
    await this.getUsername()
    this.getBooksAddedToReadList(this.username);
  }
}
