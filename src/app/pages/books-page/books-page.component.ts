import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { Book } from "../../models/Book";
import { NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { BookRequest } from "../../models/BookRequest";
import { Genres } from "../../models/Genres";

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss']
})
export class BooksPageComponent implements OnInit {
  books: Book[] = [];
  booksToDisplay: Book[] = [];
  bookRequest: BookRequest = new BookRequest('bookId', '', '', [''], [''], null);
  genres = Genres;
  selectedGenre = '';

  constructor(
    private booksService: BooksService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks() {
    this.booksService.getAllBooks().subscribe((response) => {
      this.books = response;
      this.booksToDisplay = response;
    })
  }

  addBook(modalReference: any) {
    this.booksService.addBook(this.bookRequest).subscribe((response) => {
      this.getAllBooks();
    });
    modalReference.close();
    setTimeout(() => {
      this.clearBookRequest();
    }, 200)
  }

  editBook(modalReference: any) {
    this.booksService.editBook(this.bookRequest).subscribe(() => {
      this.getAllBooks();
    });
    modalReference.close();
    setTimeout(() => {
      this.clearBookRequest();
    }, 200);
  }

  deleteBook(bookId: string) {
    this.booksService.deleteBook(bookId).subscribe(() => {
      this.getAllBooks();
    });
  }

  removeInput(field: any, i: number) {
    field.splice(i, 1);
  }

  addInput(field: any) {
    field.push("");
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onEditPress(modalReference: any, book: any) {
    this.triggerModal(modalReference);
    this.bookRequest = {...book};
  }

  closeModal(modalReference: any) {
    modalReference.close()
    setTimeout(() => {
      this.clearBookRequest();
    }, 200)
  }

  triggerModal(content: any) {
    this.modalService.open(content, {centered: true, scrollable: true});
  }

  filterBooksByGenre(genre: string) {
    this.selectedGenre = genre;
    this.booksToDisplay = this.books.filter((book) => book.genres.indexOf(genre) != -1);
  }

  displayAllBooks() {
    this.selectedGenre = '';
    this.booksToDisplay = this.books;
  }

  private clearBookRequest() {
    this.bookRequest = new BookRequest('bookId', '', '', [''], [''], null);
  }
}
