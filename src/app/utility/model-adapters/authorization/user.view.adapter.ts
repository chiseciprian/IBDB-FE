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
        adapt.email = data.email;
        adapt.lastName = data.lastName;
        adapt.firstName = data.firstName;
        adapt.role = <UserRoleEnum>data.role;

        return adapt;
    }

}
