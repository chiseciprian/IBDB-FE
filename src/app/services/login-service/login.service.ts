import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AccountRequest } from "../../utility/requests/authorization/account.request";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseURL = "http://localhost:9005/security";
  endpoints = {
    createAccount: () => this.baseURL + "/create-account"
  }

  constructor(
    private http: HttpClient
  ) { }

  createAccount(account: AccountRequest) {
    return this.http.post(this.endpoints.createAccount(), account, httpOptions);
  }
}
