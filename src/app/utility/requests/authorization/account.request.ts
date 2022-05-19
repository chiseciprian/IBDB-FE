export class AccountRequest {
  constructor(
    public firstName: string,
    public lastName: string,
    public userName: string,
    public password: string,
    public email: string
  ) {
  }
}
