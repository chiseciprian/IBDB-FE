import { Component, Input, OnInit } from '@angular/core';
import { BooksService } from "../../services/books-service/books.service";
import { KeycloakService } from "keycloak-angular";
import { ActivatedRoute } from "@angular/router";
import { Book } from "../../models/book";

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {

  handler: any = null;
  bookIdParam: string = '';
  username: string = '';
  @Input() book: Book = new Book('', '', '', 0, [], [], [], '', '', 0, []);

  constructor(
    private booksService: BooksService,
    private keycloakService: KeycloakService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.loadStripe();
    const bookIdParam = this.route.snapshot.paramMap.get('bookId');
    if (bookIdParam) {
      this.bookIdParam = bookIdParam;
    }
    this.username = this.keycloakService.getUsername();
  }

  pay(amount: any) {

    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51KxGiAHdVCPrYB8grWSgvGp6cJgnUIOHc7zNbHa9Cc7dr0GerFaH00fi3sOFs2sDqePWVh1DP6dNjPHKIOegds0700srwGydc3',
      locale: 'auto',
      token: (token: any) => {
        this.buyBook(this.username, this.bookIdParam);
      }
    });

    handler.open({
      name: this.book.title,
      description: '1 book',
      amount: this.book.price * 100
    });
    // this.buyBook(this.keycloakService.getUsername(), this.bookIdParam);
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
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token)
            alert('Payment Success!!');
          }
        });
      }

      window.document.body.appendChild(s);
    }
  }

  buyBook(username: string, bookId: string) {
    this.booksService.buyBook(username, bookId).subscribe();
  }
}
