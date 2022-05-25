import { Component, OnInit } from '@angular/core';
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthViewModel } from "../../utility/models/authorization/auth.view.model";
import { AccountRequest } from "../../utility/requests/authorization/account.request";
import { LoginService } from "../../services/login-service/login.service";
import { UserRoleEnum } from "../../utility/enums/authorization/user-role.enum";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  accountRequest: AccountRequest = new AccountRequest();

  roleAsWriter: boolean = false;
  accountNeeded: boolean = false;
  showPassword: boolean = false;
  errorMessage: string;
  formWasSubmitted = false;

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
    this.errorMessage = '';
  }

  signUp() {
    this.accountNeeded = true;
    this.errorMessage = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin(isFormValid: any) {
    if (isFormValid) {
      this.authorizationService.signIn(
        this.accountRequest.userName,
        this.accountRequest.password
      ).subscribe((response: AuthViewModel) => {
        this.errorMessage = '';
        this.router.navigateByUrl('/home');
      }, (error: HttpErrorResponse) => {
        console.error(error)
        this.errorMessage = error.error.message;
      });
    } else {
      this.formWasSubmitted = true;
    }

  }

  createAccount(isFormValid: any) {
    if (isFormValid) {
      this.accountRequest.role = this.roleAsWriter ? UserRoleEnum.WRITER : UserRoleEnum.USER;
      this.loginService.createAccount(this.accountRequest).subscribe(() => {
        this.onLogin(isFormValid);
      }, (error: HttpErrorResponse) => {
        console.error(error);
        this.errorMessage = error.error.message;
      });
    } else {
      this.formWasSubmitted = true;
    }
  }

}
