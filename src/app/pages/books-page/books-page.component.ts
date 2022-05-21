import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BookRequest } from "../../utility/requests/books/book.request";
import { GenresEnum } from "../../utility/enums/genres.enum";
import { DomSanitizer } from "@angular/platform-browser";
import { CoverViewModel } from "../../utility/models/books/cover.view.model";
import { BookFileViewModel } from "../../utility/models/books/book-file.view.model";
import { BookViewModel } from "../../utility/models/books/book.view.model";
import { RatingsService } from "../../services/ratings-service/ratings.service";

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss']
})
export class BooksPageComponent implements OnInit {
  books: BookViewModel[] = [];
  filteredBooks: BookViewModel[] = [];
  bookRequest: BookRequest = new BookRequest();
  genres = GenresEnum;
  selectedGenre = '';
  selectedImage = '';
  selectedBookFile = '';
  cover: any;
  bookFile: any;
  showSpinner = true;
  selectedBookId = '';

  constructor(
    private booksService: BooksService,
    private modalService: NgbModal,
    private _sanitizer: DomSanitizer,
    private ratingService: RatingsService
  ) {
  }

  ngOnInit(): void {
    this.getAllBooks();

    this.initializeAuthorsAndGenres();
  }

  getAllBooks() {
    this.booksService.getAllBooks().subscribe((response: any) => {
      this.books = response;

      this.books.map((book) => {
        this.ratingService.getRatingAverage(book.bookId).subscribe(average => {
          book.ratingAverage = average;
        });

        if (book.coverId) {
          this.booksService.getCover(book.coverId).subscribe((response) => {
            book.cover = response.image.data;
          })
        }

        if (book.fileId) {
          this.booksService.getBookFile(book.fileId).subscribe((response) => {
            book.file = response.bookFile.data;
          })
        }

        return book;
      })


      this.filteredBooks = response;
      setTimeout(() => {
        this.showSpinner = false
      }, 200);
    })
  }

  addBook(modalReference: any) {
    this.booksService.addBookFile(this.bookFile).subscribe((file: BookFileViewModel) => {
      this.bookRequest.fileId = file.fileId;
      this.booksService.addCover(this.cover).subscribe((response: CoverViewModel) => {
        this.bookRequest.coverId = response.coverId;
        this.booksService.addBook(this.bookRequest).subscribe(() => {
          this.getAllBooks();
        });
      });
    })

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

  onFileSelected2(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedBookFile = file.name;
      const formData = new FormData();
      formData.append('title', this.bookRequest.title)
      formData.append('bookFile', file);

      this.bookFile = formData;
    }
  }

  updateBook(modalReference: any) {
    if (this.cover && this.bookFile) {
      this.booksService.addBookFile(this.bookFile).subscribe((file: BookFileViewModel) => {
        this.bookRequest.fileId = file.fileId;
        this.booksService.addCover(this.cover).subscribe((response: CoverViewModel) => {
          this.bookRequest.coverId = response.coverId;
          this.booksService.updateBook(this.bookRequest).subscribe(() => {
            this.getAllBooks();
          });
        });
      })
    } else if (this.cover) {
      this.booksService.addCover(this.cover).subscribe((response: CoverViewModel) => {
        this.bookRequest.coverId = response.coverId;
        this.booksService.updateBook(this.bookRequest).subscribe(() => {
          this.getAllBooks();
        });
      });
    } else if (this.bookFile) {
      this.booksService.addBookFile(this.bookFile).subscribe((response: BookFileViewModel) => {
        this.bookRequest.fileId = response.fileId;
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

  onDeleteBook(bookId: string, deleteModal: any) {
    this.selectedBookId = bookId;
    this.triggerModal(deleteModal);
  }

  deleteBook(modal: any) {
    this.closeModal(modal);
    this.booksService.deleteBook(this.selectedBookId).subscribe(() => {
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
    this.filteredBooks = this.books.filter((book) => book.genres.indexOf(genre) != -1);
  }

  displayAllBooks() {
    this.selectedGenre = '';
    this.filteredBooks = this.books;
  }

  private triggerModal(content: any) {
    this.modalService.open(content, {centered: true, scrollable: true});
  }

  private clearBookRequest() {
    this.bookRequest = new BookRequest();
    this.initializeAuthorsAndGenres();
    this.selectedImage = '';
    this.selectedBookFile = '';
    this.cover = null;
    this.bookFile = null;
  }

  private initializeAuthorsAndGenres() {
    this.bookRequest.authors = [''];
    this.bookRequest.genres = [''];
    this.bookRequest.addedToReadList = [];
    this.bookRequest.users = [];
  }
}
