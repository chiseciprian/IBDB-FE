import { Component, OnInit } from '@angular/core';
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { UserViewModel } from "../../utility/models/authorization/user.view.model";
import { UserRoleEnum } from "../../utility/enums/authorization/user-role.enum";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: UserViewModel | null;
  userRole = UserRoleEnum;

  constructor(
    private router: Router,
    private authorizationService: AuthorizationServiceRepository
  ) {
  }

  ngOnInit(): void {
    this.subscribeOnToken();

    this.user = AuthorizationServiceRepository.getCurrentUserValue();
  }

  subscribeOnToken() {
    this.authorizationService.currentTokenSubject
      .subscribe((token: string) => {
        console.log(token);
        if (!AuthorizationServiceRepository.getCurrentTokenValue()) {
          this.router.navigateByUrl('/login');
          this.user = null;
        } else {
          this.user = AuthorizationServiceRepository.getCurrentUserValue();
        }
      })
  }

  logout() {
    this.authorizationService.logout();
  }

  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
}
