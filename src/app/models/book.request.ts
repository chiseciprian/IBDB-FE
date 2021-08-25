export class BookRequest {
  constructor(
    public bookId: string,
    public title: string,
    public description: string,
    public authors: Array<string>,
    public genres: Array<string>,
    public coverId: String,
    public addedToReadList: boolean
  ) {
  }

}
