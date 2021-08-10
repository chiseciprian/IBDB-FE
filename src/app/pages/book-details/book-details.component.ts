import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BooksService } from "../../services/books.service";
import { RatingsService } from "../../services/ratings.service";
import { Rating } from "../../models/Rating";
import { Book } from "../../models/Book";
import { NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { RatingRequest } from "../../models/RatingRequest";

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  book = new Book('', '', '', [], [], null);
  ratings: Rating[] = [];
  bookId: string = '';
  ratingRequest: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private ratingService: RatingsService,
    private modalService: NgbModal,
    config: NgbRatingConfig
  ) {
    config.max = 5;
    const bookIdParam = this.route.snapshot.paramMap.get('bookId');
    if (bookIdParam) {
      this.bookId = bookIdParam;
      this.ratingRequest = new RatingRequest('ratingId', this.bookId, 'Cipri', '', '', Math.floor(Date.now() / 1000), -1);
      this.getBookById(this.bookId);
      this.getRatingsByBookId(this.bookId);
    }
  }

  ngOnInit(): void {
  }

  addRating(modalReference: any) {
    this.ratingService.addRating(this.ratingRequest).subscribe((response) => {
      this.getRatingsByBookId(this.bookId);
    });
    this.clearInvoiceRequest();
    modalReference.close();
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

  deleteRating(ratingId: string) {
    this.ratingService.deleteRating(ratingId).subscribe(() => {
      this.getRatingsByBookId(this.bookId);
    });
  }

  deleteBook(bookId: string) {
    this.booksService.deleteBook(bookId).subscribe(() => {
      this.router.navigateByUrl('/books');
    });
  }

  closeModal(modalReference: any) {
    this.clearInvoiceRequest();
    modalReference.close()
  }

  triggerModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  private clearInvoiceRequest() {
    this.ratingRequest = new RatingRequest('ratingId', this.bookId, 'Cipri', '', '', Math.floor(Date.now() / 1000), -1);
  }
}
