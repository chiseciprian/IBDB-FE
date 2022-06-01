import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { BookModel } from "../../utility/models/books/book.model";
import { BookRequest } from "../../utility/requests/books/book.request";
import { map } from "rxjs/operators";
import { RatingsService } from "../ratings-service/ratings.service";
import { CoverModel } from "../../utility/models/books/cover.model";
import { BookFileModel } from "../../utility/models/books/book-file.model";
import { CoverAdapter } from "../../utility/model-adapters/books/cover.adapter";
import { BookFileAdapter } from "../../utility/model-adapters/books/book-file.adapter";
import { BookAdapter } from "../../utility/model-adapters/books/book.adapter";
import { BookViewModel } from "../../utility/models/books/book.view.model";
import { BookViewAdapter } from "../../utility/model-adapters/books/book.view.adapter";

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
    getBooksAddedToReadList: (username: string) => this.baseURL + `/books/read-list?username=${username}`,
    getPurchasedBooks: (username: string) => this.baseURL + `/books/my-books?username=${username}`,
    getBooksByAuthorUsername: (username: string) => this.baseURL + `/books/author?username=${username}`
  }

  constructor(
    private http: HttpClient,
    private ratingService: RatingsService,
    private bookAdapter: BookAdapter,
    private bookViewAdapter: BookViewAdapter,
    private coverAdapter: CoverAdapter,
    private bookFileAdapter: BookFileAdapter
  ) {
  }

  getAllBooks(): Promise<BookViewModel[]> {
    return this.getBookWithProperties(this.endpoints.getAllBooks());
  }

  getBookById(bookId: string): Observable<BookModel> {
    return this.http.get<BookModel>(this.endpoints.getBookById(bookId))
      .pipe(map((book: any) => this.bookAdapter.adapt(book)));
  }

  getBooksAddedToReadList(username: string): Promise<BookViewModel[]> {
    return this.getBookWithProperties(this.endpoints.getBooksAddedToReadList(username));
  }

  getBooksByAuthorUsername(username: string): Promise<BookViewModel[]> {
    return this.getBookWithProperties(this.endpoints.getBooksByAuthorUsername(username));
  }

  getPurchasedBooks(username: string): Promise<BookViewModel[]> {
    return this.getBookWithProperties(this.endpoints.getPurchasedBooks(username));
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

  getCover(coverId: string): Observable<CoverModel> {
    return this.http.get(this.endpoints.getCover(coverId))
      .pipe(map((cover: any) => this.coverAdapter.adapt(cover)));
  }

  getBookFile(fileId: string): Observable<BookFileModel> {
    return this.http.get(this.endpoints.getBookFile(fileId))
      .pipe(map((file: any) => this.bookFileAdapter.adapt(file)));
  }

  addCover(formData: FormData): Observable<CoverModel> {
    return this.http.post(this.endpoints.addCover(), formData)
      .pipe(map((cover: any) => this.coverAdapter.adapt(cover)));
  }

  getBookWithProperties(url: string): Promise<BookViewModel[]> {
    return new Promise(((resolve, reject) => {
      this.http.get(url)
        .pipe(map((books: any) => books.map((book: any) => this.bookViewAdapter.adapt(book))))
        .subscribe((response: any) => {
          const promises: any[] = [];
          response.forEach((bookViewModel: BookViewModel) => {
            promises.push(
              new Promise(((resolve1) => {
                const promisesBookProperties = [];
                promisesBookProperties.push(
                  new Promise((resolveBookAverageRating) => {
                    this.ratingService.getRatingAverage(bookViewModel.bookId).subscribe(average => {
                      bookViewModel.ratingAverage = average;
                      resolveBookAverageRating(bookViewModel);
                    }, (error: HttpErrorResponse) => {
                      resolveBookAverageRating(bookViewModel);
                    });
                  }),
                  new Promise((resolveBookCover) => {
                    this.getCover(bookViewModel.coverId).subscribe(response => {
                      bookViewModel.cover = response.image.data;
                      resolveBookCover(bookViewModel);
                    }, (error: HttpErrorResponse) => {
                      resolveBookCover(bookViewModel);
                    });
                  }),
                  new Promise((resolveBookFile) => {
                    this.getBookFile(bookViewModel.fileId).subscribe(response => {
                      bookViewModel.file = response.bookFile.data;
                      resolveBookFile(bookViewModel);
                    }, (error: HttpErrorResponse) => {
                      resolveBookFile(bookViewModel);
                    });
                  })
                );

                Promise.all(promisesBookProperties)
                  .then((booksData: any) => {
                    resolve1(booksData);
                  });
              }))
            );
          });

          Promise.all(promises)
            .then(() => resolve(response));
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    }));
  }
}
