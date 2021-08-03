import {Timestamp} from "rxjs";

export interface Rating {
  ratingId: string;
  bookId: string;
  userName: string;
  title: string;
  message: string;
  date: Timestamp<any>;
  stars: number;
}
