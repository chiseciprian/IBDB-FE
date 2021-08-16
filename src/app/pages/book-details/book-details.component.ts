import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BooksService } from "../../services/books-service/books.service";
import { RatingsService } from "../../services/ratings-service/ratings.service";
import { Rating } from "../../models/Rating";
import { Book } from "../../models/Book";
import { NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { RatingRequest } from "../../models/RatingRequest";
import { WebsocketService } from "../../services/websocket-service/websocket.service";

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book = new Book('', '', '', [], [], null, 0);
  ratings: Rating[] = [];
  bookId: string = '';
  ratingRequest: any;

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

  onEditPress(modalReference: any, rating: any) {
    this.triggerModal(modalReference);
    this.ratingRequest = {...rating};
  }

  closeModal(modalReference: any) {
    modalReference.close();
    setTimeout(() => {
      this.clearRatingRequest();
    }, 200);
  }

  getBookById(bookId: string) {
    return this.booksService.getBookById(bookId).subscribe((response) => {
      this.book = response;
    })
  }

  getRatingsByBookId(bookId: string) {
    return this.ratingService.getAllRatingsByBookId(bookId).subscribe((response) => {
      this.ratings = response;
    })
  }

  addRating(modalReference: any) {
    this.ratingService.addRating(this.ratingRequest).subscribe();
    modalReference.close();
    setTimeout(() => {
      this.clearRatingRequest();
    }, 200);
  }

  updateRating(modalReference: any) {
    this.ratingService.updateRating(this.ratingRequest).subscribe(() => {
      this.getBookById(this.bookId);
      this.getRatingsByBookId(this.bookId);
    });
    modalReference.close();
    setTimeout(() => {
      this.clearRatingRequest();
    }, 200);
  }

  deleteRating(ratingId: string) {
    this.ratingService.deleteRating(ratingId).subscribe();
  }

  deleteBook(bookId: string) {
    this.booksService.deleteBook(bookId).subscribe(() => {
      this.router.navigateByUrl('/books');
    });
  }

  triggerModal(content: any) {
    this.modalService.open(content, {centered: true, scrollable: true});
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
  }

  private clearRatingRequest() {
    this.ratingRequest = new RatingRequest('ratingId', this.bookId, 'Cipri', '', '', Math.floor(Date.now() / 1000), 1);
  }
}
