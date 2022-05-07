import { Component, OnInit } from '@angular/core';
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string = '';

  constructor(
    private keycloakService: KeycloakService
  ) {
  }

  ngOnInit(): void {
    this.username = this.keycloakService.getUsername();
  }

  logout(): void {
    this.keycloakService.logout();
  }
}
