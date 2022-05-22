import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BooksService } from "../../services/books-service/books.service";
import { RatingsService } from "../../services/ratings-service/ratings.service";
import { BookModel } from "../../utility/models/books/book.model";
import { NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { RatingRequest } from "../../utility/requests/ratings/rating.request";
import { WebsocketService } from "../../services/websocket-service/websocket.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Location } from '@angular/common';
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { RatingViewModel } from "../../utility/models/ratings/rating.view.model.";
import { BookViewModel } from "../../utility/models/books/book.view.model";
import { RatingModel } from "../../utility/models/ratings/rating.model.";

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book = new BookViewModel();
  ratings: RatingViewModel[] = [];
  bookId: string = '';
  ratingRequest: RatingRequest = new RatingRequest();
  showSpinner = true;
  username: string = '';
  editedMessage = false;
  selectedRatingId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private ratingService: RatingsService,
    private ws: WebsocketService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private location: Location,
    config: NgbRatingConfig
  ) {
    config.max = 5;
    const bookIdParam = this.route.snapshot.paramMap.get('bookId');
    if (bookIdParam) {
      this.bookId = bookIdParam;
      if(AuthorizationServiceRepository.getCurrentUserValue()) {
        this.username = AuthorizationServiceRepository.getCurrentUserValue().userName;
      }
      this.clearRatingRequest();
      this.getBookById(this.bookId);
      this.getRatingsByBookId(this.bookId);
    }
  }

  ngOnInit(): void {
    this.subscribeToWebsocket();
  }

  subscribeToWebsocket() {
    this.ws.connect();
    this.ws.subscribe(event => {
      console.log(event);
      setTimeout(() => {
        this.getRatingsByBookId(this.bookId);
      }, 300);
    });
  }

  getBookById(bookId: string) {
    return this.booksService.getBookById(bookId).subscribe((response: any) => {
      this.book = response;

      this.ratingService.getRatingAverage(this.book.bookId).subscribe(average => {
        this.book.ratingAverage = average;
      });

      if (this.book.coverId) {
        this.booksService.getCover(this.book.coverId).subscribe((response) => {
          this.book.cover = response.image.data;
        })
      }

      if (this.book.fileId) {
        this.booksService.getBookFile(this.book.fileId).subscribe((response) => {
          this.book.file = response.bookFile.data;
        })
      }

      setTimeout(() => {
        this.showSpinner = false
      }, 200);
    }, error => {
      console.error(error);
      this.router.navigateByUrl('/**');
    })
  }

  getRatingsByBookId(bookId: string) {
    return this.ratingService.getAllRatingsByBookId(bookId).subscribe((response) => {
      this.ratings = response;
    })
  }

  addRating(ratingForm: any) {
    this.ratingService.addRating(this.ratingRequest).subscribe((res) => {
      ratingForm.reset();

      setTimeout(() => {
        this.clearRatingRequest();
      }, 100);
    });
  }

  editRating(ratingForm: any) {
    this.ratingService.updateRating(this.ratingRequest).subscribe((res) => {
      ratingForm.reset();
      this.editedMessage = false;

      setTimeout(() => {
        this.clearRatingRequest();
      }, 100);

      setTimeout(() => {
        this.getRatingsByBookId(this.bookId);
      }, 300);
    });
  }

  deleteRating(modal: any) {
    this.closeModal(modal);
    this.ratingService.deleteRating(this.selectedRatingId).subscribe();
  }

  updateIsAddedToReadList(book: BookModel) {
    let indexOf = book.addedToReadList.indexOf(this.username);
    if (indexOf === -1) {
      book.addedToReadList.push(this.username);
    } else {
      book.addedToReadList.splice(indexOf, 1);
    }
    this.booksService.updateBook(book).subscribe(() => {
      this.getBookById(book.bookId);
    });
  }

  onEditMessage(rating: RatingModel) {
    this.editedMessage = true;
    this.ratingRequest.ratingId = rating.ratingId;
    this.ratingRequest.title = rating.title;
    this.ratingRequest.message = rating.message;
    this.ratingRequest.stars = rating.stars;
  }

  onCancelEditMessage(ratingForm: any) {
    this.editedMessage = false;
    this.clearRatingRequest();
    ratingForm.reset();
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
  }

  openPdfFile() {
    var newWindow = window.open();
    if (newWindow) {
      newWindow.document.write('<embed type="application/pdf" src="' + 'data:application/pdf;base64,' + this.book.file + '" width="100%" height="100%" />');
    }
  }

  goBack() {
    this.location.back();
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  onDeleteRating(ratingId: string, deleteModal: any) {
    this.selectedRatingId = ratingId;
    this.triggerModal(deleteModal);
  }

  closeModal(modalReference: any) {
    modalReference.close()
  }

  private triggerModal(content: any) {
    this.modalService.open(content, {centered: true, scrollable: true});
  }

  private clearRatingRequest() {
    this.ratingRequest = new RatingRequest();
    this.ratingRequest.ratingId = 'ratingId';
    this.ratingRequest.bookId = this.bookId;
    this.ratingRequest.userName = this.username;
    this.ratingRequest.title = '';
    this.ratingRequest.message = '';
    this.ratingRequest.date = Math.floor(Date.now() / 1000);
    this.ratingRequest.stars = 1;
  }
}
