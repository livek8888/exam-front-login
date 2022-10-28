import axios from "axios";
import { FormEvent, ReactElement, useEffect, useState } from "react";
import JoinRequestDto from "../../dto/request/JoinRequest";
import JoinResponseDto from "../../dto/response/JoinResponse";
import style from "../../styles/join.module.css";

export default function Join() {
  // Join 입력값
  const [reqBody, setReqBody] = useState(
    new JoinRequestDto("", "", "", "", "")
  );

  // 유효성검사 메시지
  const [validationComment, setValidationComment] =
    useState<ReactElement | null>(null);

  // 암호 재확인 메시지
  const [checkPwComment, setCheckPwComment] = useState<ReactElement | null>(
    null
  );

  //Response data
  const [userDatas, setUserDatas] = useState<string | null>(null);

  const requestAction = async () => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "api/user",
        reqBody
      );
      if (res.status === 201) {
        const resJoinData = new JoinResponseDto(
          res.data.id,
          res.data.account,
          res.data.name,
          res.data.email,
          res.data.created_at,
          res.data.updated_at
        );
        setUserDatas(resJoinData.format());
        return alert("회원가입 성공 \n" + resJoinData.name + " 님 반갑습니다.");
      }
    } catch (err: any) {
      console.log(err);
      if (
        err.response.status === 409 &&
        err.response.data.message === "account already exist"
      ) {
        setUserDatas(null);
        return alert("이미 해당 아이디로 가입된 계정이 존재합니다.");
      }
      if (
        err.response.status === 409 &&
        err.response.data.message === "email already exist"
      ) {
        setUserDatas(null);
        return alert("이미 해당 이메일로 가입된 계정이 존재합니다.");
      }
      setUserDatas(null);
      return alert("페이지가 원활하지 않습니다.\n잠시 후 다시 이용해주세요.");
    }
  };

  // 유효성검사
  const joinValidation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const idChecker = /^[A-Za-z\d\_]{4,12}$/;
    const pwChecker = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[_!@#$()%^]).{8,20}$/;
    const nameChecker = /^[가-힣]{2,10}|\s[a-zA-Z]{2,10}|[a-zA-Z]{2,10}$/;
    const pwFirstString = reqBody.password[0];

    if (
      reqBody.account === "" ||
      reqBody.password === "" ||
      reqBody.passwordCheck === "" ||
      reqBody.name === "" ||
      reqBody.email === ""
    ) {
      return alert("비어있는 항목이 있습니다.\n 다시 확인 해주세요.");
    }

    if (
      idChecker.test(reqBody.account) &&
      pwChecker.test(reqBody.password) &&
      nameChecker.test(reqBody.name) &&
      pwFirstString === pwFirstString.toUpperCase() &&
      checkPwComment === null
    ) {
      return requestAction();
    }

    setValidationComment(
      <div className={style.fail_validation}>
        <p>가입정보를 다시 확인해주세요.</p>
        <p>{"아이디 : 영문 필수 4~12글자 숫자 및 _ 기호 사용가능"}</p>
        <p>
          {
            "비밀번호 : 첫 문자는 영문 대문자. 영문 대문자, 소문자, 숫자, 특수기호 _ ! @ # $ ( ) % ^ 필수 4~12글자"
          }
        </p>
        <p>이름 : 한글, 영문 혼용불가. 한글, 영문 사용 가능 2~10글자</p>
        <p>이메일 : 이메일 형식에 맞춰 작성해주세요.</p>
      </div>
    );
  };

  // 암호 재확인 Event
  useEffect(() => {
    if (reqBody.password !== reqBody.passwordCheck) {
      return setCheckPwComment(<p>재확인 암호가 일치하지 않습니다.</p>);
    }
    return setCheckPwComment(null);
  }, [reqBody.password, reqBody.passwordCheck]);

  return (
    <div className={style.container}>
      <h1>Join</h1>
      <form className={style.join_form} onSubmit={joinValidation}>
        <input
          type="text"
          className={style.join_input}
          name="userId"
          placeholder="아이디를 입력하세요."
          onChange={(e) => {
            setReqBody(
              new JoinRequestDto(
                e.target.value,
                reqBody.password,
                reqBody.passwordCheck,
                reqBody.name,
                reqBody.email
              )
            );
          }}
          value={reqBody.account}
          minLength={4}
          maxLength={12}
        />
        <input
          type="password"
          className={style.join_input}
          name="userPw"
          placeholder="암호를 입력하세요."
          onChange={(e) => {
            setReqBody(
              new JoinRequestDto(
                reqBody.account,
                e.target.value,
                reqBody.passwordCheck,
                reqBody.name,
                reqBody.email
              )
            );
          }}
          value={reqBody.password}
          minLength={8}
          maxLength={20}
        />
        <input
          type="password"
          className={style.join_input}
          name="passwordCheck"
          placeholder="암호를 한번 더 입력하세요."
          onChange={(e) => {
            setReqBody(
              new JoinRequestDto(
                reqBody.account,
                reqBody.password,
                e.target.value,
                reqBody.name,
                reqBody.email
              )
            );
          }}
          value={reqBody.passwordCheck}
          minLength={8}
          maxLength={20}
        />
        {checkPwComment}
        <input
          type="text"
          className={style.join_input}
          name="userName"
          placeholder="이름을 입력하세요."
          onChange={(e) => {
            setReqBody(
              new JoinRequestDto(
                reqBody.account,
                reqBody.password,
                reqBody.passwordCheck,
                e.target.value,
                reqBody.email
              )
            );
          }}
          value={reqBody.name}
          minLength={2}
          maxLength={10}
        />
        <input
          type="email"
          className={style.join_input}
          name="userEmail"
          placeholder="이메일을 입력하세요."
          onChange={(e) => {
            setReqBody(
              new JoinRequestDto(
                reqBody.account,
                reqBody.password,
                reqBody.passwordCheck,
                reqBody.name,
                e.target.value
              )
            );
          }}
          value={reqBody.email}
        />
        <input type="submit" className={style.join_submit} value="회원가입" />
        {validationComment}
      </form>
      {userDatas}
    </div>
  );
}
