import { Component, OnInit } from '@angular/core';
import { UserViewModel } from "../../utility/models/authorization/user.view.model";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { LoginService } from "../../services/login-service/login.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserRoleEnum } from "../../utility/enums/authorization/user-role.enum";
import { AccountUpdateRequest } from "../../utility/requests/authorization/account-update.request";
import { UserModel } from "../../utility/models/authorization/user.model";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  user: UserViewModel;
  showPassword: boolean = false;
  newPassword = '';
  accountRequest = new AccountUpdateRequest();
  userRoles = UserRoleEnum;
  roleAsWriter: boolean = false;
  errorMessage: string;

  constructor(
    private loginService: LoginService,
    private modalService: NgbModal,
    private authorizationService: AuthorizationServiceRepository
  ) {
  }

  ngOnInit(): void {
    this.user = AuthorizationServiceRepository.getCurrentUserValue();
    this.initializeAccountRequest();
  }

  initializeAccountRequest() {
    this.accountRequest.firstName = this.user.firstName;
    this.accountRequest.lastName = this.user.lastName;
    this.accountRequest.userName = this.user.userName;
    this.accountRequest.email = this.user.email;
    this.accountRequest.role = this.user.role;

    this.roleAsWriter = this.user.role === this.userRoles.WRITER;
  }

  getNewUserModel() {
    const userModel = new UserModel();
    userModel.id = this.user.id;
    userModel.firstName = this.accountRequest.firstName;
    userModel.lastName = this.accountRequest.lastName;
    userModel.userName = this.accountRequest.userName;
    userModel.email = this.accountRequest.email;
    userModel.role = this.accountRequest.role;

    return userModel;
  }

  editProfile(profileModal: any) {
    this.accountRequest.role = this.roleAsWriter ? UserRoleEnum.WRITER : UserRoleEnum.USER;
    this.loginService.updateAccount(this.user.id, this.accountRequest)
      .subscribe(
        () => {
          AuthorizationServiceRepository.setCurrentUserValue(this.getNewUserModel())
          this.closeModal(profileModal);
          this.authorizationService.currentTokenSubject.next(AuthorizationServiceRepository.getCurrentTokenValue());
        }
      )
  }

  changePassword(deleteModal: any) {
    this.loginService.changePassword(this.user.id, this.newPassword)
      .subscribe(
        () => {
          this.closeModal(deleteModal);
        }
      );
  }

  deleteAccount(deleteModal: any) {
    this.loginService.deleteAccount(this.user.id)
      .subscribe(
        () => {
          this.authorizationService.logout()
          this.closeModal(deleteModal);
        }
      );
  }

  onEditProfile(profileModal: any) {
    this.triggerModal(profileModal);
  }

  onChangePassword(passwordModal: any) {
    this.triggerModal(passwordModal);
  }

  onDeleteAccount(deleteModal: any) {
    this.triggerModal(deleteModal);
  }

  closeModal(modalReference: any) {
    modalReference.close()
    this.newPassword = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private triggerModal(content: any) {
    this.modalService.open(content, {centered: true, scrollable: true});
  }
}
