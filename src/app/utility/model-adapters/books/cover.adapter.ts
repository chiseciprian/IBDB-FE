import { Injectable } from "@angular/core";
import { ModelAdapter } from "../authorization/model-adapter";
import { CoverModel } from "../../models/books/cover.model";

@Injectable({
  providedIn: 'root'
})
export class CoverAdapter implements ModelAdapter<CoverModel> {

  adapt(data: any): CoverModel {
    const adapt = new CoverModel();
    adapt.coverId = data.coverId;
    adapt.title = data.title;
    adapt.image = data.image;

    return adapt;
  }

}
