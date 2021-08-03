import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BooksService} from "../../services/books.service";
import {RatingsService} from "../../services/ratings.service";
import {Rating} from "../../models/Rating";
import { Book } from "../../models/Book";

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  book = new Book('','','',[],[],null);
  ratings: Rating[] = [];

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    private ratingService: RatingsService
  ) {
    const bookId = this.route.snapshot.paramMap.get('bookId');
    if (bookId) {
      this.getBookById(bookId);
      this.getRatingsByBookId(bookId);
    }
  }

  ngOnInit(): void {
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
}
