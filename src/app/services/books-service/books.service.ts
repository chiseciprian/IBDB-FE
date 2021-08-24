import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Book } from "../../models/book";
import { BookRequest } from "../../models/book.request";
import { map } from "rxjs/operators";
import { RatingsService } from "../ratings-service/ratings.service";
import { Cover } from "../../models/cover";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class BooksService {
  baseURL = "http://localhost:8080";
  endpoints = {
    getAllBooks: () => this.baseURL + "/books",
    getBookById: (bookId: string) => this.baseURL + "/books/" + bookId,
    addBook: () => this.baseURL + "/books",
    deleteBook: (bookId: string) => this.baseURL + "/books/" + bookId,
    updateBook: () => this.baseURL + "/books",
    getCover: (coverId: string) => this.baseURL + "/books/cover/" + coverId,
    addCover: () => this.baseURL + "/books/cover/add",
  }

  constructor(private http: HttpClient, private ratingService: RatingsService) {
  }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.endpoints.getAllBooks())
      .pipe(map(books => books.map(book => {
        this.ratingService.getRatingAverage(book.bookId).subscribe(average => {
          book.ratingAverage = average;
        });

        if (book.coverId) {
          this.getCover(book.coverId).subscribe((response) => {
            book.cover = response.image.data;
          })
        }
        return book;
      })));
  }

  getBookById(bookId: string): Observable<Book> {
    return this.http.get<Book>(this.endpoints.getBookById(bookId))
      .pipe(map(book => {
        this.ratingService.getRatingAverage(book.bookId).subscribe(average => {
          book.ratingAverage = average;
        });

        if (book.coverId) {
          this.getCover(book.coverId).subscribe((response) => {
            book.cover = response.image.data;
          })
        }
        return book;
      }));
  }

  addBook(bookRequest: BookRequest) {
    return this.http.post(this.endpoints.addBook(), bookRequest, httpOptions);
  }

  deleteBook(bookId: string) {
    return this.http.delete(this.endpoints.deleteBook(bookId), httpOptions);
  }

  updateBook(bookRequest: BookRequest) {
    return this.http.put(this.endpoints.updateBook(), bookRequest, httpOptions);
  }

  getCover(coverId: string): Observable<Cover> {
    return this.http.get<Cover>(this.endpoints.getCover(coverId));
  }

  addCover(formData: FormData): Observable<Cover> {
    return this.http.post<Cover>(this.endpoints.addCover(), formData)
  }
}
