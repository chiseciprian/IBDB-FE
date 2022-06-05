import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksPageComponent } from "./pages/books-page/books-page.component";
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { HomeComponent } from "./pages/home/home.component";
import { BookDetailsComponent } from "./pages/book-details/book-details.component";
import { ReadListComponent } from "./pages/read-list/read-list.component";
import { LoginComponent } from "./pages/login/login.component";
import { PurchasedBooksComponent } from "./pages/purchased-books/purchased-books.component";
import { AuthGuard } from "./guards/auth/auth.guard";
import { AuthorBooksComponent } from "./pages/author-books/author-books.component";
import { AccountSettingsComponent } from "./pages/account-settings/account-settings.component";
import { UserRoleEnum } from "./utility/enums/authorization/user-role.enum";
import { RolesGuard } from "./guards/roles/roles.guard";

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
    path: 'read-list/:bookId',
    component: BookDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'library',
    component: PurchasedBooksComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: [UserRoleEnum.USER, UserRoleEnum.WRITER]
    }
  },
  {
    path: 'library/:bookId',
    component: BookDetailsComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: [UserRoleEnum.USER, UserRoleEnum.WRITER]
    }
  },
  {
    path: 'my-books',
    component: AuthorBooksComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: [UserRoleEnum.WRITER]
    }
  },
  {
    path: 'my-books/:bookId',
    component: BookDetailsComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: [UserRoleEnum.WRITER]
    }
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'home/:bookId',
    component: BookDetailsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    canActivate: [AuthGuard]
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
