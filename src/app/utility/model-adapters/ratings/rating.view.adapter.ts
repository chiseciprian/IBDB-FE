import { Injectable } from "@angular/core";
import { ModelAdapter } from "../authorization/model-adapter";
import { RatingViewModel } from "../../models/ratings/rating.view.model.";

@Injectable({
  providedIn: 'root'
})
export class RatingViewAdapter implements ModelAdapter<RatingViewModel>{

  adapt(data: any): RatingViewModel {
    const adapt = new RatingViewModel();
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
