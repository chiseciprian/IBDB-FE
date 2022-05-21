import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthAdapter } from "../../utility/model-adapters/authorization/auth.adapter";
import { UserModel } from "../../utility/models/authorization/user.model";
import { TokenModel } from "../../utility/models/authorization/token.model";
import jwt_decode from 'jwt-decode';
import { AuthModel } from "../../utility/models/authorization/auth.model";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { AuthRequest } from "../../utility/requests/authorization/auth.request";

export const TOKEN_NAME = `token`;
export const USER_NAME = `user`;
export const CURRENT_ENV_NAME = `currentEnv`;

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthorizationServiceRepository {

  public currentTokenSubject: Subject<any> = new Subject<any>();
  baseURL = "http://localhost:9005";
  endpoints = {
    signIn: () => this.baseURL + '/auth/token'
  }

  constructor(
    private http: HttpClient,
    private authAdapter: AuthAdapter
  ) {
  }

  static setCurrentTokenValue(token: string) {
    localStorage.setItem(TOKEN_NAME, token);
  }

  static setCurrentUserValue(user: UserModel) {
    localStorage.setItem(USER_NAME, JSON.stringify(user));
  }

  static getCurrentTokenValue(): string {
    return <string>localStorage.getItem(TOKEN_NAME);
  }

  static setCurrentEnvValue(env: string) {
    localStorage.setItem(CURRENT_ENV_NAME, env);
  }

  static getCurrentEnvValue(): string {
    return <string>localStorage.getItem(CURRENT_ENV_NAME);
  }

  static getCurrentUserValue(): UserModel {
    return JSON.parse(<string>localStorage.getItem(USER_NAME));
  }

  static getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode<TokenModel>(token);
    if (decoded.exp === undefined) {
      // @ts-ignore
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  static isTokenExpired(): boolean {
    const token = AuthorizationServiceRepository.getCurrentTokenValue();
    if (!token) {
      return true;
    }

    const date = AuthorizationServiceRepository.getTokenExpirationDate(token);
    if (date === undefined) {
      return true;
    }

    return !(date.valueOf() > new Date().valueOf());
  }

  signIn(email: string, password: string): Observable<AuthModel> {
    const request = new AuthRequest();
    request.username = email;
    request.password = password;

    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      `Basic ${btoa(request.username + ':' + request.password)}`
    );

    localStorage.removeItem(TOKEN_NAME);
    localStorage.removeItem(USER_NAME);
    localStorage.removeItem(CURRENT_ENV_NAME);

    return this.http.get(this.endpoints.signIn(), httpOptions)
      .pipe(
        map((response: any) => this.authAdapter.adapt(response))
      )
      .pipe(
        map((response: AuthModel) => {
          AuthorizationServiceRepository.setCurrentTokenValue(response.token);
          AuthorizationServiceRepository.setCurrentUserValue(response.user);
          AuthorizationServiceRepository.setCurrentEnvValue(`currentEnv`);
          this.currentTokenSubject.next(response.token);

          return response;
        })
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_NAME);
    localStorage.removeItem(USER_NAME);
    localStorage.removeItem(CURRENT_ENV_NAME);
    this.currentTokenSubject.next(null);
  }

}
