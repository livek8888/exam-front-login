export default class LoginRequestDto {
  public account: string;
  public password: string;

  constructor(account: string, password: string) {
    (this.account = account), (this.password = password);
  }
}
