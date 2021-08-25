export class Book {
  constructor(
    public bookId: string,
    public title: string,
    public description: string,
    public authors: Array<string>,
    public genres: Array<string>,
    public coverId: string,
    public cover: string,
    public ratingAverage: number,
    public addedToReadList: boolean
  ) {
  }
}
