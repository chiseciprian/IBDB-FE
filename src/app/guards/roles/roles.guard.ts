import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentUserRole = AuthorizationServiceRepository.getCurrentUserValue().role;

    const canActivate = !!route.data.roles.find((role: any) => currentUserRole === role)

    if (!canActivate) {
      this.router.navigateByUrl('/home')
    }

    return canActivate;
  }

}
