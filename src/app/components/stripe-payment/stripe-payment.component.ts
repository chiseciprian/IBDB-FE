import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { ActivatedRoute } from "@angular/router";
import { Book } from "../../utility/models/book";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {

  handler: any = null;
  bookIdParam: string = '';
  username: string = '';
  @Input() book: Book = new Book('', '', '', 0, [], [], [], '', '', '', '', 0, []);
  @Output() bookBought = new EventEmitter<any>();

  constructor(
    private booksService: BooksService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.loadStripe();
    const bookIdParam = this.route.snapshot.paramMap.get('bookId');
    if (bookIdParam) {
      this.bookIdParam = bookIdParam;
    }
    this.username = AuthorizationServiceRepository.getCurrentUserValue().userName;
  }

  pay() {

    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51KxGiAHdVCPrYB8grWSgvGp6cJgnUIOHc7zNbHa9Cc7dr0GerFaH00fi3sOFs2sDqePWVh1DP6dNjPHKIOegds0700srwGydc3',
      locale: 'auto',
      token: (token: any) => {
        this.buyBook(this.username, this.bookIdParam);
        setTimeout(() => {
          this.bookBought.emit();
        }, 300);
      }
    });

    handler.open({
      name: this.book.title,
      description: '1 book',
      amount: this.book.price * 100,
      currency: 'ron'
    });
  }

  loadStripe() {

    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51KxGiAHdVCPrYB8grWSgvGp6cJgnUIOHc7zNbHa9Cc7dr0GerFaH00fi3sOFs2sDqePWVh1DP6dNjPHKIOegds0700srwGydc3',
          locale: 'auto',
          token: function (token: any) {
          }
        });
      }

      window.document.body.appendChild(s);
    }
  }

  private buyBook(username: string, bookId: string) {
    this.booksService.buyBook(username, bookId).subscribe();
  }
}
