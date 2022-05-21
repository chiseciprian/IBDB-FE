import { Injectable } from "@angular/core";
import { ModelAdapter } from "./model-adapter";
import { AuthViewModel } from "../../models/authorization/auth.view.model";
import { UserViewAdapter } from "./user.view.adapter";

@Injectable({
  providedIn: 'root'
})
export class AuthViewAdapter implements ModelAdapter<AuthViewModel> {

    constructor(
        private userAdapter: UserViewAdapter
    ) {
    }

    adapt(data: any): AuthViewModel {
        const adapt = new AuthViewModel();
        adapt.token = data.token;
        adapt.user = this.userAdapter.adapt(data.user);

        return adapt;
    }

}
