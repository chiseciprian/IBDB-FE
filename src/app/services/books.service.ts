import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Book} from "../models/Book";

@Injectable({
  providedIn: 'root'
})

export class BooksService {
  headers = {
    'Content-Type': 'application/json'
  }

  baseURL = "http://localhost:8080";
  endpoints = {
    getAllBooks: () => this.baseURL + "/books",
    getBookById: (bookId: string) => this.baseURL + "/books/" + bookId
  }

  constructor(private http: HttpClient) {
  }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.endpoints.getAllBooks());
  }

  getBookById(bookId: string): Observable<Book> {
    return this.http.get<Book>(this.endpoints.getBookById(bookId));
  }
}
