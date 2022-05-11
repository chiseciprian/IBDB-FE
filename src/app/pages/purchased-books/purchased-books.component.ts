import { Component, OnInit } from '@angular/core';
import { Book } from "../../models/book";
import { BooksService } from "../../services/books-service/books.service";
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: 'app-purchased-books',
  templateUrl: './purchased-books.component.html',
  styleUrls: ['./purchased-books.component.scss']
})
export class PurchasedBooksComponent implements OnInit {

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

  getPurchasedBooks(username: string) {
    this.booksService.getPurchasedBooks(username).subscribe((response) => {
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
    this.getPurchasedBooks(this.username);
  }

}
