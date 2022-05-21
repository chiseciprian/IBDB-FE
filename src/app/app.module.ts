import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BooksPageComponent } from './pages/books-page/books-page.component';
import { HomeComponent } from './pages/home/home.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { FormsModule } from "@angular/forms";
import { ReadListComponent } from './pages/read-list/read-list.component';
import { LoginComponent } from './pages/login/login.component';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';
import { PurchasedBooksComponent } from './pages/purchased-books/purchased-books.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BooksPageComponent,
    HomeComponent,
    ErrorPageComponent,
    BookDetailsComponent,
    ReadListComponent,
    LoginComponent,
    StripePaymentComponent,
    PurchasedBooksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
