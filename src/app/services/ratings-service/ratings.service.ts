import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { RatingModel } from "../../utility/models/ratings/rating.model.";
import { RatingRequest } from "../../utility/requests/ratings/rating.request";
import { RatingAdapter } from "../../utility/model-adapters/ratings/rating.adapter";
import { map } from "rxjs/operators";

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

  constructor(
    private http: HttpClient,
    private ratingAdapter: RatingAdapter
  ) {
  }

  getAllRatingsByBookId(bookId: string): Observable<RatingModel[]> {
    return this.http.get<RatingModel[]>(this.endpoints.getRatingsByBookId(bookId))
      .pipe(map((ratings: any) =>
        ratings.map((rating: any) => this.ratingAdapter.adapt(rating))
      ));
  }

  getRatingAverage(bookId: string): Observable<number> {
    return this.http.get<number>(this.endpoints.getRatingAverage(bookId));
  }

  addRating(ratingRequest: RatingRequest): Observable<RatingModel> {
    return this.http.post(this.endpoints.addRating(), ratingRequest, httpOptions)
      .pipe(map((rating) => this.ratingAdapter.adapt(rating)));
  }

  updateRating(ratingRequest: RatingRequest): Observable<RatingModel> {
    return this.http.put(this.endpoints.updateRating(), ratingRequest, httpOptions)
      .pipe(map((rating) => this.ratingAdapter.adapt(rating)));
  }

  deleteRating(ratingId: string) {
    return this.http.delete(this.endpoints.deleteRating(ratingId), httpOptions);
  }
}
