export class BookModel {

  public bookId: string;
  public title: string;
  public description: string;
  public price: number;
  public authors: Array<string>;
  public users: Array<string>;
  public genres: Array<string>;
  public coverId: string;
  public fileId: string;
  public addedToReadList: Array<string>;

}
