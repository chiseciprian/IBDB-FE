import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {

  handler: any = null;

  constructor() {
  }

  ngOnInit() {
    this.loadStripe();
  }

  pay(amount: any) {

    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51KxGiAHdVCPrYB8grWSgvGp6cJgnUIOHc7zNbHa9Cc7dr0GerFaH00fi3sOFs2sDqePWVh1DP6dNjPHKIOegds0700srwGydc3',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token)
        alert('Save username and bookId to DB');
      }
    });

    handler.open({
      name: 'Demo Payment',
      description: '1 book',
      amount: amount * 100
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
}
