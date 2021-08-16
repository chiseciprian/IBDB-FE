import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Book } from "../../models/Book";
import { BookRequest } from "../../models/BookRequest";
import { map } from "rxjs/operators";

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
    editBook: () => this.baseURL + "/books",
    getRatingAverage: (bookId: string) => this.baseURL + "/ratings/average/book/" + bookId
  }

  constructor(private http: HttpClient) {
  }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.endpoints.getAllBooks())
      .pipe(map(books => books.map(book => {
        this.getRatingAverage(book.bookId).subscribe(average => {
          book.ratingAverage = average;
        });
        return book;
      })));
  }

  getBookById(bookId: string): Observable<Book> {
    return this.http.get<Book>(this.endpoints.getBookById(bookId))
      .pipe(map(book => {
        this.getRatingAverage(book.bookId).subscribe(average => {
          book.ratingAverage = average;
        });
        console.log(book);
        return book;
      }));
  }

  addBook(bookRequest: BookRequest) {
    return this.http.post(this.endpoints.addBook(), bookRequest, httpOptions);
  }

  deleteBook(bookId: string) {
    return this.http.delete(this.endpoints.deleteBook(bookId), httpOptions);
  }

  editBook(bookRequest: BookRequest) {
    return this.http.put(this.endpoints.editBook(), bookRequest, httpOptions);
  }

  getRatingAverage(bookId: string): Observable<number> {
    return this.http.get<number>(this.endpoints.getRatingAverage(bookId));
  }
}
