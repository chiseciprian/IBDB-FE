import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BooksService} from "../../services/books.service";

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  book: any;

  constructor(
    private route: ActivatedRoute,
    private service: BooksService
  ) {
  }

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('bookId');
    if (bookId) {
      this.getBookById(bookId);
    }
  }

  getBookById(bookId: string) {
    return this.service.getBookById(bookId).subscribe((response) => {
      this.book = response;
    })
  }
}
