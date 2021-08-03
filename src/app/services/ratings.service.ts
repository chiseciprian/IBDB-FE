import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Rating} from "../models/Rating";

@Injectable({
  providedIn: 'root'
})
export class RatingsService {
  headers = {
    'Content-Type': 'application/json'
  }

  baseURL = "http://localhost:8080";
  endpoints = {
    getRatingsByBookId: (bookId: string) => this.baseURL + "/ratings/book/" + bookId
  }

  constructor(private http: HttpClient) {
  }

  getAllRatingsByBookId(bookId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(this.endpoints.getRatingsByBookId(bookId));
  }
}
