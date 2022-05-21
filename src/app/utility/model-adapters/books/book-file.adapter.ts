import { Injectable } from "@angular/core";
import { ModelAdapter } from "../authorization/model-adapter";
import { BookFileModel } from "../../models/books/book-file.model";

@Injectable({
  providedIn: 'root'
})
export class BookFileAdapter implements ModelAdapter<BookFileModel> {

  adapt(data: any): BookFileModel {
    const adapt = new BookFileModel();
    adapt.fileId = data.fileId;
    adapt.title = data.title;
    adapt.bookFile = data.bookFile;

    return adapt;
  }

}
