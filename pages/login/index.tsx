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

  const [userIdValidation, setUserIdValidation] = useState<ReactElement | null>(
    <div className={styles.validation}>
      <p>{"아이디 : 영문 필수 4~12글자 (숫자 및 _ 기호 사용가능)"}</p>
    </div>
  );

  const [userPwValidation, setUserPwValidation] = useState<ReactElement | null>(
    <div className={styles.validation}>
      <p>
        {
          "비밀번호 : 첫글자는 대문자이며 영문,숫자, ( _ ! @ # $ ( ) % ^ ) 기호 사용가능"
        }
      </p>
    </div>
  );

  const loginEvent = async () => {

    /**
     * 서버로 전송할 값 정의
     * account : 유저가 입력한 로그인 아이디,
     * password : 유저가 입력한 로그인 비밀번호
     */
    const account =  reqBody.userId;
    const password =  reqBody.userPw;

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

  const onSubmitEvent = () => {
    console.log("onSubmit!");
    loginEvent();
  };

  const loginValidation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const idChecker = /^[A-Za-z\d\_]{4,12}$/;
    const pwChecker =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[_!@#$()%^])[A-Za-z\d_!@#$()%^]{8,20}$/;
    const pwFirstString = reqBody.userPw[0];
    let result = true;
    if (!idChecker.test(reqBody.userId)) {
      setUserIdValidation(
        <div className={styles.fail_validation}>
          <p>아이디를 다시 확인해주세요. </p>
          <p>{"영문 필수 4~12글자 (숫자 및 _ 기호 사용가능)"}</p>
        </div>
      );
      result = false;
    } else {
      setUserIdValidation(null);
    }
    if (
      !pwChecker.test(reqBody.userPw) ||
      pwFirstString !== pwFirstString.toUpperCase()
    ) {
      setUserPwValidation(
        <div className={styles.fail_validation}>
          <p>비밀번호를 다시 확인해주세요. </p>
          <p>
            {
              "첫글자는 대문자이며 영문,숫자, ( _ ! @ # $ ( ) % ^ ) 기호 사용가능"
            }
          </p>
        </div>
      );
      result = false;
    } else {
      setUserPwValidation(null);
    }
    if (result) {
      onSubmitEvent();
    }
    console.log(
      "유효성검사 통과! " + " 아이디는 : " + reqBody.userId,
      ", 암호는 : " + reqBody.userPw + " 입니다."
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
        {userIdValidation}
        <input
          type="password"
          className={styles.login_input}
          name="userPw"
          placeholder="암호를 입력하세요."
          onChange={handleValue}
          value={reqBody.userPw}
        ></input>
        {userPwValidation}
        <input type="submit" className={styles.login_submit} value="로그인" />
      </form>
    </div>
  );
}
