import { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import styles from "../../styles/login.module.css";

type Login = {
  userId: string;
  userPw: string;
};

export default function login() {
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
  };

  const loginValidation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const idChecker = /(?=.*[A-Za-z])[A-Za-z\d_]{4,12}$/;
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
    console.log(reqBody, result);
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
