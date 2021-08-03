export class BookRequest {
  constructor(
    public title: string,
    public description: string,
    public authors: Array<string>,
    public genres: Array<string>,
    public poster: any
  ) {
  }

}
