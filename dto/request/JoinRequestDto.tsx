export default class JoinRequestDto {
  public account: string;
  public password: string;
  public passwordCheck: string;
  public name: string;
  public email: string;

  constructor(
    account: string,
    password: string,
    passwordCheck: string,
    name: string,
    email: string
  ) {
    (this.account = account),
      (this.password = password),
      (this.passwordCheck = passwordCheck),
      (this.name = name),
      (this.email = email);
  }
}
