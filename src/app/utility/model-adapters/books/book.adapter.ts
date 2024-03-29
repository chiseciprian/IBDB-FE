import { Injectable } from "@angular/core";
import { ModelAdapter } from "../authorization/model-adapter";
import { BookModel } from "../../models/books/book.model";

@Injectable({
  providedIn: 'root'
})
export class BookAdapter implements ModelAdapter<BookModel> {

  adapt(data: any): BookModel {
    const adapt = new BookModel();
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
