import { FormEvent, ReactElement, useState } from "react";
import styles from "../../styles/login.module.css";
import LoginResponseDto from "../../dto/response/LoginResponse";
import LoginRequestDto from "../../dto/request/LoginRequest";
import axios from "axios";

export default function Login() {
  //Login 입력값
  const [reqBody, setReqBody] = useState<LoginRequestDto>(
    new LoginRequestDto("", "")
  );
  console.log(reqBody);
  //Login 유효성검사 실패 시 발생메시지
  const [validationComment, setValidationComment] =
    useState<ReactElement | null>(null);

  //Response data
  const [userDatas, setUserDatas] = useState<string | null>(null);
  //Login event
  const loginEvent = async () => {
    /**
     * 서버로 전송할 값 정의
     * account : 유저가 입력한 로그인 아이디,
     * password : 유저가 입력한 로그인 비밀번호
     */
    const account = reqBody.userId;
    const password = reqBody.userPw;

    /**
     * try => .env에 저장한 APIURL로 값 {account, password} post
     * 정상이라면 로그인성공 알림
     *
     * catch => 정상이 아닌 경우 서버로 부터 받아온 status를 확인
     * 404번 이라면 유저의 id,pw값이 잘못되었다고 판단, 메시지 알림
     * 그 외 에러가 발생한 것이라면 Web의 문제로 판단하고 메시지 알림
     */
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "api/login",
        {
          account,
          password,
        }
      );
      if (res.status === 200) {
        const resLoginData = new LoginResponseDto(
          res.data.id,
          res.data.account,
          res.data.name,
          res.data.created_at,
          res.data.updated_at
        );
        setUserDatas(resLoginData.format());
        return alert("로그인 성공!");
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        return alert(
          "일치하는 계정이 존재하지 않습니다.\n아이디 또는 암호를 다시 확인해주세요."
        );
      }
      return alert("페이지가 원활하지 않습니다.\n잠시 후 다시 이용해주세요.");
    }
  };

  //Login 입력 값 유효성 검사
  const loginValidation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /**
     * idChecker = 영문 필수, 숫자 허용, 특수기호(_ 만 허용) 최소 4글자  ~ 최대 12글자
     * pwChecker = 영문 대, 소문자 + 숫자 + 특수기호 ( _,!,@,#,$,(,),%,^ 만 허용) 포함하여 최소 8자 ~ 최대 20자
     * pwFirstString = PW 첫글자
     */
    const idChecker = /^[A-Za-z\d\_]{4,12}$/;
    const pwChecker = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[_!@#$()%^]).{8,20}$/;
    const pwFirstString = reqBody.userPw[0];

    /**
     * ID 또는 PW 중 하나라도 비어있을 경우 알림 및 동작 중단
     */
    if (reqBody.userId === "" || reqBody.userPw === "") {
      return alert("아이디 또는 패스워드를 입력하지 않았습니다.");
    }

    /**
     * 규칙에 따른 유효성 검사
     * 성공 시 loginEvent 시작
     */
    if (
      idChecker.test(reqBody.userId) &&
      pwChecker.test(reqBody.userPw) &&
      pwFirstString === pwFirstString.toUpperCase()
    ) {
      return loginEvent();
    }

    /**
     * 유효성 검사 실패 시 유저에게 보여줄 메시지
     */
    setValidationComment(
      <div className={styles.fail_validation}>
        <p>아이디 또는 비밀번호를 다시 확인해주세요.</p>
        <p>{"아이디 : 영문 필수 4~12글자 (숫자 및 _ 기호 사용가능)"}</p>
        <p>
          {
            "비밀번호 : 첫 문자는 영문 대문자, 영문, 숫자, 특수기호 _ ! @ # $ ( ) % ^ 필수 4~12글자"
          }
        </p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form className={styles.login_form} onSubmit={loginValidation}>
        <input
          type="text"
          className={styles.login_input}
          name="userId"
          placeholder="아이디를 입력하세요."
          onChange={(e) => {
            setReqBody(new LoginRequestDto(e.target.value, reqBody.userPw));
          }}
          value={reqBody.userId}
        ></input>
        <input
          type="password"
          className={styles.login_input}
          name="userPw"
          placeholder="암호를 입력하세요."
          onChange={(e) => {
            setReqBody(new LoginRequestDto(reqBody.userId, e.target.value));
          }}
          value={reqBody.userPw}
        ></input>
        <input type="submit" className={styles.login_submit} value="로그인" />
        {validationComment}
      </form>
      {userDatas}
    </div>
  );
}
