import { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import style from "../../styles/login.module.css";
import LoginResponseDto from "../../dto/response/LoginResponseDto";
import LoginRequestDto from "../../dto/request/LoginRequestDto";
import axios from "axios";
import InputComponent from "../../components/InputComponent";

interface Ibody {
  account: string;
  password: string;
}

export default function Login() {
  const LoginRequestData = new LoginRequestDto("", "");

  //Login 입력값
  const [reqBody, setReqBody] = useState<Ibody>({
    account: "",
    password: "",
  });

  //Login 유효성검사 실패 시 발생메시지
  const [validationComment, setValidationComment] =
    useState<ReactElement | null>(null);

  //Response data
  const [userDatas, setUserDatas] = useState<string | null>(null);

  //Login event
  const loginEvent = async () => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "api/login",
        LoginRequestData
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

    const idChecker = /^[A-Za-z\d\_]{4,12}$/;
    const pwChecker = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[_!@#$()%^]).{8,20}$/;
    const pwFirstString = reqBody.password[0];

    if (reqBody.account === "" || reqBody.password === "") {
      return alert("아이디 또는 패스워드를 입력하지 않았습니다.");
    }

    if (
      idChecker.test(reqBody.account) &&
      pwChecker.test(reqBody.password) &&
      pwFirstString === pwFirstString.toUpperCase()
    ) {
      Object.assign(LoginRequestData, reqBody);
      return loginEvent();
    }

    setValidationComment(
      <div className={style.fail_validation}>
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

  // handle value
  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = { ...reqBody, [name]: value };
    setReqBody(newValue);
  };

  return (
    <div className={style.container}>
      <h1>Login</h1>
      <form className={style.login_form} onSubmit={loginValidation}>
        <InputComponent
          type="text"
          name="account"
          holdStr="아이디를 입력하세요."
          onChange={handleValue}
          value={reqBody.account}
          length={{ min: 4, max: 12 }}
        />
        <InputComponent
          type="password"
          name="password"
          holdStr="암호를 입력하세요."
          onChange={handleValue}
          value={reqBody.password}
          length={{ min: 8, max: 20 }}
        />
        <input type="submit" className={style.login_submit} value="로그인" />
        {validationComment}
      </form>
      {userDatas}
    </div>
  );
}
