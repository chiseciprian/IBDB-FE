import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Rating } from "../../models/rating";
import { RatingRequest } from "../../models/rating.request";

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
    deleteRating: (ratingId: string) => this.baseURL + "/ratings/" + ratingId,
    updateRating: () => this.baseURL + "/ratings",
    getRatingAverage: (bookId: string) => this.baseURL + "/ratings/average/book/" + bookId
  }

  constructor(private http: HttpClient) {
  }

  getAllRatingsByBookId(bookId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(this.endpoints.getRatingsByBookId(bookId));
  }

  getRatingAverage(bookId: string): Observable<number> {
    return this.http.get<number>(this.endpoints.getRatingAverage(bookId));
  }

  addRating(ratingRequest: RatingRequest) {
    return this.http.post(this.endpoints.addRating(), ratingRequest, httpOptions)
  }

  updateRating(ratingRequest: RatingRequest) {
    return this.http.put(this.endpoints.updateRating(), ratingRequest, httpOptions)
  }

  deleteRating(ratingId: string) {
    return this.http.delete(this.endpoints.deleteRating(ratingId), httpOptions);
  }
}
