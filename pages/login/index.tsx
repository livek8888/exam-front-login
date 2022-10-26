import { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import styles from "../../styles/login.module.css";
import axios from "axios";

type Login = {
  userId: string;
  userPw: string;
};

export default function Login() {
  const [reqBody, setReqBody] = useState<Login>({
    userId: "",
    userPw: "",
  });

  const [validationComment, setValidationComment] =
    useState<ReactElement | null>(null);

  const loginEvent = async () => {
    /**
     * 서버로 전송할 값 정의
     * account : 유저가 입력한 로그인 아이디,
     * password : 유저가 입력한 로그인 비밀번호
     */
    const account = reqBody.userId;
    const password = reqBody.userPw;

    /**
     * .env에 저장한 APIURL로 값 {account, password} post
     */
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "api/login",
      { account, password }
    );

    if (
      response.status === 200 &&
      response.data.message === "login sucsses!!"
    ) {
      alert("로그인 성공!");
    } else if (response.status !== 200) {
      alert("통신 실패!");
    } else {
      alert("로그인 실패! 다시 로그인 해주세요!");
    }
  };

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newInputs = {
      ...reqBody,
      [name]: value,
    };
    setReqBody(newInputs);
  };

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
      console.log("입력값이 비어있음.");
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
      console.log("success!");
      return loginEvent();
    }

    /**
     * 유효성 검사 실패 시 유저에게 보여줄 메시지
     */
    setValidationComment(
      <div className={styles.fail_validation}>
        <p>아이디 또는 비밀번호를 다시 확인해주세요.</p>
        <p>{"아이디 : 영문 필수 4~12글자 (숫자 및 _ 기호 사용가능)"}</p>
        <p>{"비밀번호 : 첫 문자는 영문 대문자, 영문, 숫자, 특수기호 _ ! @ # $ ( ) % ^ 필수 4~12글자"}</p>
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
          onChange={handleValue}
          value={reqBody.userId}
        ></input>
        <input
          type="password"
          className={styles.login_input}
          name="userPw"
          placeholder="암호를 입력하세요."
          onChange={handleValue}
          value={reqBody.userPw}
        ></input>
        <input type="submit" className={styles.login_submit} value="로그인" />
        {validationComment}
      </form>
    </div>
  );
}
