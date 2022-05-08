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
    this.keycloakService.loadUserProfile().then(
      (response) => {
        this.username = response.firstName + ' ' + response.lastName;
      }
    );
  }

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout();
  }

  redirectToProfile() {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }
}
