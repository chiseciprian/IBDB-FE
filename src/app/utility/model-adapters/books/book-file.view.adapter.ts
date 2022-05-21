import { Injectable } from "@angular/core";
import { ModelAdapter } from "../authorization/model-adapter";
import { BookFileViewModel } from "../../models/books/book-file.view.model";

@Injectable({
  providedIn: 'root'
})
export class BookFileViewAdapter implements ModelAdapter<BookFileViewModel> {

  adapt(data: any): BookFileViewModel {
    const adapt = new BookFileViewModel();
    adapt.fileId = data.fileId;
    adapt.title = data.title;
    adapt.bookFile = data.bookFile;

    return adapt;
  }

}
