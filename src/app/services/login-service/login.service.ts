import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AccountRequest } from "../../utility/requests/authorization/account.request";
import { AccountUpdateRequest } from "../../utility/requests/authorization/account-update.request";

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
    createAccount: () => this.baseURL + "/create-account",
    updateAccount: (accountId: number) => this.baseURL + `/account/${accountId}`,
    deleteAccount: (accountId: number) => this.baseURL + `/account/${accountId}`,
    changePassword: (accountId: number) => this.baseURL + `/account/${accountId}/change-password`
  }

  constructor(
    private http: HttpClient
  ) {
  }

  createAccount(account: AccountRequest) {
    return this.http.post(this.endpoints.createAccount(), account, httpOptions);
  }

  updateAccount(accountId: number, accountRequest: AccountUpdateRequest) {
    return this.http.put(this.endpoints.updateAccount(accountId), accountRequest);
  }

  deleteAccount(accountId: number) {
    return this.http.delete(this.endpoints.deleteAccount(accountId));
  }

  changePassword(accountId: number, newPassword: string) {
    return this.http.put(this.endpoints.changePassword(accountId), newPassword);
  }
}
