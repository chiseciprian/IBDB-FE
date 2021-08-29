import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BooksService } from "../../services/books-service/books.service";
import { RatingsService } from "../../services/ratings-service/ratings.service";
import { Rating } from "../../models/rating";
import { Book } from "../../models/book";
import { NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { RatingRequest } from "../../models/rating.request";
import { WebsocketService } from "../../services/websocket-service/websocket.service";

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book = new Book('', '', '', [], [], '', '', 0, false);
  ratings: Rating[] = [];
  bookId: string = '';
  ratingRequest: any;
  showSpinner=true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private ratingService: RatingsService,
    private ws: WebsocketService,
    private modalService: NgbModal,
    config: NgbRatingConfig
  ) {
    config.max = 5;
    const bookIdParam = this.route.snapshot.paramMap.get('bookId');
    if (bookIdParam) {
      this.bookId = bookIdParam;
      this.ratingRequest = new RatingRequest('ratingId', this.bookId, 'Cipri', '', '', Math.floor(Date.now() / 1000), 1);
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
    this.ratingService.addRating(this.ratingRequest).subscribe(() => {
      ratingForm.reset();

      setTimeout(() => {
        this.clearRatingRequest();
      }, 100);
    });
  }

  deleteRating(ratingId: string) {
    this.ratingService.deleteRating(ratingId).subscribe();
  }

  updateIsAddedToReadList(book: Book) {
    book.addedToReadList = !book.addedToReadList;
    this.booksService.updateBook(book).subscribe(() => {
      this.getBookById(book.bookId);
    });
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
  }

  private clearRatingRequest() {
    this.ratingRequest = new RatingRequest('ratingId', this.bookId, 'Cipri', '', '', Math.floor(Date.now() / 1000), 1);
  }
}
