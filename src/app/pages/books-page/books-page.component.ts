import { Component, OnInit } from '@angular/core';
import { BooksService } from "../../services/books.service";
import { Book } from "../../models/Book";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BookRequest } from "../../models/BookRequest";

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss']
})
export class BooksPageComponent implements OnInit {
  books: Book[] = [];
  bookRequest: BookRequest = new BookRequest('', '', [''], [''], null);

  constructor(
    private booksService: BooksService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks() {
    this.booksService.getAllBooks().subscribe((response) => {
      this.books = response;
    })
  }

  addBook(modalReference: any) {
    // this.booksService.addBook(this.bookRequest).subscribe((response) => {
    //   this.getAllBooks();
    // });
    console.log(this.bookRequest);
    this.clearInvoiceRequest();
    modalReference.close();
  }

  removeValue(field: any, i: number) {
    field.splice(i, 1);
  }

  addValue(field: any) {
    field.push("");
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

  closeModal(modalReference: any) {
    this.clearInvoiceRequest();
    modalReference.close()
  }

  triggerModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  private clearInvoiceRequest() {
    this.bookRequest = new BookRequest('', '', [''], [''], null);
  }
}
