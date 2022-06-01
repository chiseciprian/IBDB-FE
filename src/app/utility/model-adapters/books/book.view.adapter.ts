import { Injectable } from "@angular/core";
import { ModelAdapter } from "../authorization/model-adapter";
import { BookViewModel } from "../../models/books/book.view.model";

@Injectable({
  providedIn: 'root'
})
export class BookViewAdapter implements ModelAdapter<BookViewModel> {

  adapt(data: any): BookViewModel {
    const adapt = new BookViewModel();
    adapt.bookId = data.bookId;
    adapt.title = data.title;
    adapt.description = data.description;
    adapt.price = data.price;
    adapt.authorName = data.authorName;
    adapt.authorUsername = data.authorUsername;
    adapt.users = data.users;
    adapt.genres = data.genres;
    adapt.coverId = data.coverId;
    adapt.bookText = data.bookText;
    adapt.fileId = data.fileId;
    adapt.addedToReadList = data.addedToReadList;

    return adapt;
  }

}
