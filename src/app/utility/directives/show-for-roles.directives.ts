import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthorizationServiceRepository } from '../../services/authorization/authorization.service.repository';

@Directive({
  selector: '[appShowForRoles]'
})
export class ShowForRolesDirective {

  @Input() set appShowForRoles(showForRoles: Array<string>) {
    const showFor = showForRoles || [];
    if (showFor.length > 0) {
      this.roleChecker(showFor);
    } else {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  roleChecker(showFor: Array<string>) {
    const userRole = AuthorizationServiceRepository.getCurrentUserValue().role;

    if (!userRole) {
      this.viewContainerRef.clear();
    } else {
      const index = showFor.indexOf(userRole);
      return index > -1 ? this.viewContainerRef.createEmbeddedView(this.templateRef) : this.viewContainerRef.clear();
    }
  }

}
