import { Component, OnInit } from '@angular/core';
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { Router } from "@angular/router";
import { UserRoleEnum } from "../../utility/enums/authorization/user-role.enum";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthViewModel } from "../../utility/models/authorization/auth.view.model";
import { AccountRequest } from "../../utility/requests/authorization/account.request";
import { LoginService } from "../../services/login-service/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  accountRequest: AccountRequest = new AccountRequest('', '', '', '', '');

  accountNeeded: boolean = false;
  showPassword: boolean = false;
  errorMessage: string;

  constructor(
    private router: Router,
    private authorizationService: AuthorizationServiceRepository,
    private loginService: LoginService
  ) {
  }

  ngOnInit(): void {
  }

  signIn() {
    this.accountNeeded = false;
  }

  signUp() {
    this.accountNeeded = true;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.authorizationService.signIn(
      this.accountRequest.userName,
      this.accountRequest.password
    ).subscribe((response: AuthViewModel) => {
      this.errorMessage = '';
      this.redirectUser(response.user.role);
    }, (error: HttpErrorResponse) => {
      this.errorMessage = 'The username or the password is incorrect.';
    });
  }

  private redirectUser(role: string) {
    if (role == UserRoleEnum.ADMIN) {
      this.router.navigateByUrl('/home');
    } else {
      this.router.navigateByUrl('/books');
    }
  }

  createAccount() {
    this.loginService.createAccount(this.accountRequest).subscribe();
  }

}
