import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BooksPageComponent} from "./pages/books-page/books-page.component";
import {ErrorPageComponent} from "./pages/error-page/error-page.component";
import {HomeComponent} from "./pages/home/home.component";
import {BookDetailsComponent} from "./pages/book-details/book-details.component";

const routes: Routes = [
  {path: 'books', component: BooksPageComponent},
  {path: 'books/:bookId', component: BookDetailsComponent},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
