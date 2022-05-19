import { UserRoleEnum } from "../../enums/authorization/user-role.enum";

export class UserModel {

    public firstName: string;
    public lastName: string;
    public userName: string;
    public password: string;
    public email: string;
    public role: UserRoleEnum;

}
