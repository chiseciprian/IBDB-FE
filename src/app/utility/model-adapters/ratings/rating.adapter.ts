import { Injectable } from "@angular/core";
import { ModelAdapter } from "../authorization/model-adapter";
import { RatingModel } from "../../models/ratings/rating.model.";

@Injectable({
  providedIn: 'root'
})
export class RatingAdapter implements ModelAdapter<RatingModel>{

  adapt(data: any): RatingModel {
    const adapt = new RatingModel();
    adapt.ratingId = data.ratingId;
    adapt.bookId = data.bookId;
    adapt.userName = data.userName;
    adapt.title = data.title;
    adapt.message = data.message;
    adapt.date = data.date;
    adapt.stars = data.stars;

    return adapt;
  }

}
