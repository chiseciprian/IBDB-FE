import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BookRequest } from "../../utility/requests/books/book.request";
import { GenresEnum } from "../../utility/enums/genres.enum";
import { DomSanitizer } from "@angular/platform-browser";
import { CoverViewModel } from "../../utility/models/books/cover.view.model";
import { BookViewModel } from "../../utility/models/books/book.view.model";
import { RatingsService } from "../../services/ratings-service/ratings.service";
import { UserRoleEnum } from "../../utility/enums/authorization/user-role.enum";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { UserViewModel } from "../../utility/models/authorization/user.view.model";

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
  userRoles = UserRoleEnum;
  user: UserViewModel;
  selectedGenre = '';
  selectedImage = '';
  fileId = '';
  cover: any;
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

    this.user = AuthorizationServiceRepository.getCurrentUserValue();
  }

  onDeleteBook(bookId: string, deleteModal: any) {
    this.selectedBookId = bookId;
    this.triggerModal(deleteModal);
  }

  onAddPress(modalReference: any) {
    this.clearBookRequest();
    this.triggerModal(modalReference);
  }

  onEditPress(modalReference: any, book: any) {
    this.triggerModal(modalReference);
    this.bookRequest = {...book};
  }

  onFileCoverSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedImage = file.name;
      const formData = new FormData();
      formData.append('title', this.bookRequest.title)
      formData.append('image', file);

      this.cover = formData;
    }
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
    this.bookRequest.authorName = this.user.firstName + ' ' + this.user.lastName;
    this.bookRequest.authorUsername = this.user.userName;
    this.booksService.addCover(this.cover).subscribe((response: CoverViewModel) => {
      this.bookRequest.coverId = response.coverId;
      this.booksService.addBook(this.bookRequest).subscribe(() => {
        this.getAllBooks();

        modalReference.close();
        setTimeout(() => {
          this.clearBookRequest();
        }, 200)
      });
    });
  }

  updateBook(modalReference: any) {
    const promises = [];

    promises.push(
      new Promise((coverPromise) => {
        if (this.cover) {
          this.booksService.addCover(this.cover).subscribe((response: CoverViewModel) => {
            this.bookRequest.coverId = response.coverId;
            coverPromise(response.coverId);
          });
        } else {
          coverPromise('');
        }
      })
    )

    Promise.all(promises)
      .then(() => {
        this.booksService.updateBook(this.bookRequest).subscribe(() => {
          this.getAllBooks();
          console.log(this.bookRequest)
          modalReference.close();
          setTimeout(() => {
            this.clearBookRequest();
          }, 300);
        });
      })
  }

  deleteBook(modal: any) {
    this.closeModal(modal);
    this.booksService.deleteBook(this.selectedBookId).subscribe(() => {
      this.getAllBooks();
    });
  }

  private triggerModal(content: any) {
    this.modalService.open(content, {centered: true, scrollable: true});
  }

  private clearBookRequest() {
    this.bookRequest = new BookRequest();
    this.initializeAuthorsAndGenres();
    this.selectedImage = '';
    this.fileId = '';
    this.cover = null;
  }

  private initializeAuthorsAndGenres() {
    this.bookRequest.authorName = '';
    this.bookRequest.genres = [''];
    this.bookRequest.addedToReadList = [];
    this.bookRequest.users = [];
  }
}
