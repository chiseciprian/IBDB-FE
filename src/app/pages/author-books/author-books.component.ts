import { Component, OnInit } from '@angular/core';
import { BookViewModel } from "../../utility/models/books/book.view.model";
import { BooksService } from "../../services/books-service/books.service";
import { RatingsService } from "../../services/ratings-service/ratings.service";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { BookRequest } from "../../utility/requests/books/book.request";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GenresEnum } from "../../utility/enums/genres.enum";
import { BookFileViewModel } from "../../utility/models/books/book-file.view.model";
import { CoverViewModel } from "../../utility/models/books/cover.view.model";
import { UserRoleEnum } from "../../utility/enums/authorization/user-role.enum";
import { UserViewModel } from "../../utility/models/authorization/user.view.model";

@Component({
  selector: 'app-author-books',
  templateUrl: './author-books.component.html',
  styleUrls: ['./author-books.component.scss']
})
export class AuthorBooksComponent implements OnInit {
  books: BookViewModel[] = [];
  bookRequest: BookRequest = new BookRequest();
  genres = GenresEnum;
  userRoles = UserRoleEnum;
  user: UserViewModel;
  showSpinner = true;
  username: string = '';
  selectedBookId = '';
  selectedImage = '';
  selectedBookFile = '';
  cover: any;
  bookFile: any;

  constructor(
    private booksService: BooksService,
    private ratingService: RatingsService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.initializeReadList();
    this.user = AuthorizationServiceRepository.getCurrentUserValue();
  }

  initializeReadList() {
    this.getUsername()
    this.getBooksByAuthorUsername(this.username);
  }

  getUsername() {
    this.username = AuthorizationServiceRepository.getCurrentUserValue().userName;
  }

  onAddPress(modalReference: any) {
    this.clearBookRequest();
    this.triggerModal(modalReference);
  }

  onEditPress(modalReference: any, book: any) {
    this.triggerModal(modalReference);
    this.bookRequest = {...book};
  }

  onDeleteBook(bookId: string, deleteModal: any) {
    this.selectedBookId = bookId;
    this.triggerModal(deleteModal);
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

  onBookFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedBookFile = file.name;
      const formData = new FormData();
      formData.append('title', this.bookRequest.title)
      formData.append('bookFile', file);

      this.bookFile = formData;
    }
  }

  closeModal(modalReference: any) {
    modalReference.close()
    setTimeout(() => {
      this.clearBookRequest();
    }, 200)
  }

  addInput(field: any) {
    field.push("");
  }

  removeInput(field: any, i: number) {
    field.splice(i, 1);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addBook(modalReference: any) {
    this.bookRequest.authorName = this.user.firstName + ' ' + this.user.lastName;
    this.bookRequest.authorUsername = this.user.userName;
    this.booksService.addCover(this.cover).subscribe((response: CoverViewModel) => {
      this.bookRequest.coverId = response.coverId;
      this.booksService.addBook(this.bookRequest).subscribe(() => {
        this.getBooksByAuthorUsername(this.username);

        modalReference.close();
        setTimeout(() => {
          this.clearBookRequest();
        }, 200)
      });
    });
  }

  getBooksByAuthorUsername(username: string) {
    this.booksService.getBooksByAuthorUsername(username).subscribe((response: any) => {
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

        return book;
      })

      setTimeout(() => {
        this.showSpinner = false
      }, 200);
    })
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
      }),
    )

    Promise.all(promises)
      .then(() => {
        this.booksService.updateBook(this.bookRequest).subscribe(() => {
          this.getBooksByAuthorUsername(this.username);

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
      this.getBooksByAuthorUsername(this.username)
    });
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
    this.bookRequest.authorName = '';
    this.bookRequest.genres = [''];
    this.bookRequest.addedToReadList = [];
    this.bookRequest.users = [];
  }
}
