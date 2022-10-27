export default class LoginResponse {
  public id: number;
  public account: string;
  public name: string;
  public created_at: Date;
  public updated_at: Date;

  constructor(
    id: number,
    account: string,
    name: string,
    created_at: Date,
    updated_at: Date
  ) {
    this.id = id;
    this.account = account;
    this.name = name;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  format() {
    return `회원번호 : ${this.id}, 아이디 : ${this.account}, 이름 : ${this.name}, 가입일 : ${this.created_at}, 계정변경일 : ${this.updated_at}`;
  }
}
