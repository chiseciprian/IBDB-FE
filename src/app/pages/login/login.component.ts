import { Component, OnInit } from '@angular/core';
import { LoginService } from "../../services/login-service/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(loginService: LoginService) { }

  ngOnInit(): void {
  }

}
