import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { Book } from "../../models/book";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BookRequest } from "../../models/book.request";
import { Genres } from "../../models/genres";
import { Cover } from "../../models/cover";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss']
})
export class BooksPageComponent implements OnInit {
  books: Book[] = [];
  booksToDisplay: Book[] = [];
  bookRequest: BookRequest = new BookRequest('bookId', '', '', [''], [''], '');
  genres = Genres;
  selectedGenre = '';
  selectedImage = '';
  cover: any;

  constructor(
    private booksService: BooksService,
    private modalService: NgbModal,
    private _sanitizer: DomSanitizer
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
    this.booksService.addCover(this.cover).subscribe((response: Cover) => {
      this.bookRequest.coverId = response.coverId;
      this.booksService.addBook(this.bookRequest).subscribe(() => {
        this.getAllBooks();
      });
    });
    modalReference.close();
    setTimeout(() => {
      this.clearBookRequest();
    }, 200)
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedImage = file.name;
      const formData = new FormData();
      formData.append('title', this.bookRequest.title)
      formData.append('image', file);

      this.cover = formData;
    }
  }

  updateBook(modalReference: any) {
    if (this.cover) {
      this.booksService.addCover(this.cover).subscribe((response: Cover) => {
        this.bookRequest.coverId = response.coverId;
        this.booksService.updateBook(this.bookRequest).subscribe(() => {
          this.getAllBooks();
        });
      });
    } else {
      this.booksService.updateBook(this.bookRequest).subscribe(() => {
        this.getAllBooks();
      });
    }
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

  onAddPress(modalReference: any) {
    this.clearBookRequest();
    this.triggerModal(modalReference);
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

  filterBooksByGenre(genre: string) {
    this.selectedGenre = genre;
    this.booksToDisplay = this.books.filter((book) => book.genres.indexOf(genre) != -1);
  }

  displayAllBooks() {
    this.selectedGenre = '';
    this.booksToDisplay = this.books;
  }

  private triggerModal(content: any) {
    this.modalService.open(content, {centered: true, scrollable: true});
  }

  private clearBookRequest() {
    this.bookRequest = new BookRequest('bookId', '', '', [''], [''], '');
    this.selectedImage = '';
    this.cover = null;
  }
}
