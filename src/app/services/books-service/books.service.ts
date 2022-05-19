import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Book } from "../../utility/models/book";
import { BookRequest } from "../../utility/requests/book.request";
import { map } from "rxjs/operators";
import { RatingsService } from "../ratings-service/ratings.service";
import { Cover } from "../../utility/models/cover";
import { BookFile } from "../../utility/models/book-file";

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
    buyBook: (username: string, bookId: string) => this.baseURL + `/books/buy?username=${username}&bookId=${bookId}`,
    deleteBook: (bookId: string) => this.baseURL + "/books/" + bookId,
    updateBook: () => this.baseURL + "/books",
    getCover: (coverId: string) => this.baseURL + "/books/cover/" + coverId,
    getBookFile: (fileId: string) => this.baseURL + "/books/file/" + fileId,
    addCover: () => this.baseURL + "/books/cover/add",
    addBookFile: () => this.baseURL + "/books/file/add",
    getBooksAddedToReadList: (username: string) => this.baseURL + `/books/read-list?username=${username}`,
    getPurchasedBooks: (username: string) => this.baseURL + `/books/my-books?username=${username}`
  }

  constructor(
    private http: HttpClient,
    private ratingService: RatingsService
  ) {
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

        if (book.fileId) {
          this.getBookFile(book.fileId).subscribe((response) => {
            book.file = response.bookFile.data;
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

        if (book.fileId) {
          this.getBookFile(book.fileId).subscribe((response) => {
            book.file = response.bookFile.data;
          })
        }

        return book;
      }));
  }

  getBooksAddedToReadList(username: string): Observable<Book[]> {
    return this.http.get<Book[]>(this.endpoints.getBooksAddedToReadList(username))
      .pipe(map(books => books.map(book => {
        this.ratingService.getRatingAverage(book.bookId).subscribe(average => {
          book.ratingAverage = average;
        });

        if (book.coverId) {
          this.getCover(book.coverId).subscribe((response) => {
            book.cover = response.image.data;
          })
        }

        if (book.fileId) {
          this.getBookFile(book.fileId).subscribe((response) => {
            book.file = response.bookFile.data;
          })
        }

        return book;
      })));
  }

  getPurchasedBooks(username: string): Observable<Book[]> {
    return this.http.get<Book[]>(this.endpoints.getPurchasedBooks(username))
      .pipe(map(books => books.map(book => {
        this.ratingService.getRatingAverage(book.bookId).subscribe(average => {
          book.ratingAverage = average;
        });

        if (book.coverId) {
          this.getCover(book.coverId).subscribe((response) => {
            book.cover = response.image.data;
          })
        }

        if (book.fileId) {
          this.getBookFile(book.fileId).subscribe((response) => {
            book.file = response.bookFile.data;
          })
        }

        return book;
      })));
  }

  addBook(bookRequest: BookRequest) {
    return this.http.post(this.endpoints.addBook(), bookRequest, httpOptions);
  }

  buyBook(username: string, bookId: string) {
    return this.http.post(this.endpoints.buyBook(username, bookId), httpOptions);
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

  getBookFile(fileId: string): Observable<BookFile> {
    return this.http.get<BookFile>(this.endpoints.getBookFile(fileId));
  }

  addCover(formData: FormData): Observable<Cover> {
    return this.http.post<Cover>(this.endpoints.addCover(), formData);
  }

  addBookFile(formData: FormData): Observable<BookFile> {
    return this.http.post<BookFile>(this.endpoints.addBookFile(), formData);
  }
}
