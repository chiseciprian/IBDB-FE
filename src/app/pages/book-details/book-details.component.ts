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

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book = new BookModel('', '', '', 10, [], [], [], '', '', '', '', 0, []);
  ratings: RatingViewModel[] = [];
  bookId: string = '';
  ratingRequest: any;
  showSpinner = true;
  username: string = '';

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
      this.username = AuthorizationServiceRepository.getCurrentUserValue().userName;
      this.clearRatingRequest();
      this.getBookById(this.bookId);
      this.getRatingsByBookId(this.bookId);
    }
  }

  ngOnInit(): void {
    this.ws.connect();
    this.ws.subscribe(event => {
      console.log(event);
      this.getRatingsByBookId(this.bookId);
    });
  }

  getBookById(bookId: string) {
    return this.booksService.getBookById(bookId).subscribe((response) => {
      this.book = response;
      setTimeout(() => {
        this.showSpinner = false
      }, 200);
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

  deleteRating(ratingId: string) {
    this.ratingService.deleteRating(ratingId).subscribe();
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
