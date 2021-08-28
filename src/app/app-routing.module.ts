import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksPageComponent } from "./pages/books-page/books-page.component";
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { HomeComponent } from "./pages/home/home.component";
import { BookDetailsComponent } from "./pages/book-details/book-details.component";
import { ReadListComponent } from "./pages/read-list/read-list.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: 'books',
    component: BooksPageComponent
  },
  {
    path: 'books/:bookId',
    component: BookDetailsComponent
  },
  {
    path: 'read-list',
    component: ReadListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
