import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Rating } from "../../models/Rating";
import { RatingRequest } from "../../models/RatingRequest";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RatingsService {
  baseURL = "http://localhost:8080";
  endpoints = {
    getRatingsByBookId: (bookId: string) => this.baseURL + "/ratings/book/" + bookId,
    addRating: () => this.baseURL + "/ratings",
    deleteRating: (ratingId: string) => this.baseURL + "/ratings/" + ratingId
  }

  constructor(private http: HttpClient) {
  }

  addRating(ratingRequest: RatingRequest) {
    return this.http.post(this.endpoints.addRating(), ratingRequest, httpOptions)
  }

  getAllRatingsByBookId(bookId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(this.endpoints.getRatingsByBookId(bookId));
  }

  deleteRating(ratingId: string) {
    return this.http.delete(this.endpoints.deleteRating(ratingId), httpOptions);
  }
}
