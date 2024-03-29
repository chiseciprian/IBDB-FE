import { Injectable } from "@angular/core";
import { ModelAdapter } from "./model-adapter";
import { UserViewModel } from "../../models/authorization/user.view.model";
import { UserRoleEnum } from "../../enums/authorization/user-role.enum";

@Injectable({
  providedIn: 'root'
})
export class UserViewAdapter implements ModelAdapter<UserViewModel> {

  adapt(data: any): UserViewModel {
    const adapt = new UserViewModel();
    adapt.id = data.id;
    adapt.firstName = data.firstName;
    adapt.lastName = data.lastName;
    adapt.userName = data.userName;
    adapt.email = data.email;
    adapt.role = <UserRoleEnum>data.role;

    return adapt;
  }

}
