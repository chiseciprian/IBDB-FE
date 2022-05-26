import { UserRoleEnum } from "../../enums/authorization/user-role.enum";

export class AccountUpdateRequest {

  public firstName: string;
  public lastName: string;
  public userName: string;
  public email: string;
  public role: UserRoleEnum;

}
