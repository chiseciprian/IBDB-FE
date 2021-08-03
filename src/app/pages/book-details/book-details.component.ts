import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BooksService} from "../../services/books.service";
import {RatingsService} from "../../services/ratings.service";
import {Rating} from "../../models/Rating";

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  book: any;
  ratings: Rating[] = [];

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    private ratingService: RatingsService
  ) {
  }

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('bookId');
    if (bookId) {
      this.getBookById(bookId);
      this.getRatingsByBookId(bookId);
    }
  }

  getBookById(bookId: string) {
    return this.booksService.getBookById(bookId).subscribe((response) => {
      this.book = response;
      console.log(response);
    })
  }

  getRatingsByBookId(bookId: string) {
    return this.ratingService.getAllRatingsByBookId(bookId).subscribe((response) => {
      this.ratings = response;
    })
  }
}
