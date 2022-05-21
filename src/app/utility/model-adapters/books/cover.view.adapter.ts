import { Injectable } from "@angular/core";
import { ModelAdapter } from "../authorization/model-adapter";
import { CoverViewModel } from "../../models/books/cover.view.model";

@Injectable({
  providedIn: 'root'
})
export class CoverViewAdapter implements ModelAdapter<CoverViewModel> {

  adapt(data: any): CoverViewModel {
    const adapt = new CoverViewModel();
    adapt.coverId = data.coverId;
    adapt.title = data.title;
    adapt.image = data.image;

    return adapt;
  }

}
