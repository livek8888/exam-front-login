export default class LoginRequest {
  public userId: string;
  public userPw: string;

  constructor(userId: string, userPw: string) {
    (this.userId = userId), (this.userPw = userPw);
  }
}
