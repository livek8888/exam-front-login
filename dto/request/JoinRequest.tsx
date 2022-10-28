export default class JoinRequest {
  public userId: string;
  public userPw: string;
  public checkUserPw: string;
  public userName: string;
  public userEmail: string;

  constructor(
    userId: string,
    userPw: string,
    checkUserPw: string,
    userName: string,
    userEmail: string
  ) {
    (this.userId = userId),
      (this.userPw = userPw),
      (this.checkUserPw = checkUserPw),
      (this.userName = userName),
      (this.userEmail = userEmail);
  }

  get Data() {
    return {
      account: this.userId,
      password: this.userPw,
      checkUserPw: this.checkUserPw,
      name: this.userName,
      email: this.userEmail,
    };
  }
}
