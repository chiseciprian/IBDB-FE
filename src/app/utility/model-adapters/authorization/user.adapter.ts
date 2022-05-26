import { Injectable } from "@angular/core";
import { ModelAdapter } from "./model-adapter";
import { UserModel } from "../../models/authorization/user.model";
import { UserRoleEnum } from "../../enums/authorization/user-role.enum";

@Injectable({
  providedIn: 'root'
})
export class UserAdapter implements ModelAdapter<UserModel> {

  adapt(data: any): UserModel {
    const adapt = new UserModel();
    adapt.id = data.id;
    adapt.firstName = data.firstName;
    adapt.lastName = data.lastName;
    adapt.userName = data.userName;
    adapt.email = data.email;
    adapt.role = <UserRoleEnum>data.role;

    return adapt;
  }

}
