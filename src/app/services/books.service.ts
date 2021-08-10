import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Book } from "../models/Book";
import { BookRequest } from "../models/BookRequest";

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
    deleteBook: (bookId: string) => this.baseURL + "/books/" + bookId
  }

  constructor(private http: HttpClient) {
  }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.endpoints.getAllBooks());
  }

  getBookById(bookId: string): Observable<Book> {
    return this.http.get<Book>(this.endpoints.getBookById(bookId));
  }

  addBook(bookRequest: BookRequest) {
    return this.http.post(this.endpoints.addBook(), bookRequest, httpOptions)
  }

  deleteBook(bookId: string) {
    return this.http.delete(this.endpoints.deleteBook(bookId),httpOptions);
  }
}
