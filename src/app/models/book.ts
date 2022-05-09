export class Book {
  constructor(
    public bookId: string,
    public title: string,
    public description: string,
    public price: number,
    public authors: Array<string>,
    public users: Array<string>,
    public genres: Array<string>,
    public coverId: string,
    public cover: string,
    public ratingAverage: number,
    public addedToReadList: Array<string>
  ) {
  }
}
