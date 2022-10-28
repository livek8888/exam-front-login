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

  console.log(
    "입력한 가입정보" + "\n",
    "아이디 : " + reqBody.Data.account + "\n",
    "암호 : " + reqBody.Data.password + "\n",
    "암호 재확인 : " + reqBody.Data.checkUserPw + "\n",
    "이름 : " + reqBody.Data.name + "\n",
    "이메일 : " + reqBody.Data.email
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
    const account = reqBody.Data.account;
    const password = reqBody.Data.password;
    const name = reqBody.Data.name;
    const email = reqBody.Data.email;

    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "api/user",
        {
          account,
          password,
          name,
          email,
        }
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
        return alert(
          "회원가입 성공 \n" + resJoinData.Data.name + " 님 반갑습니다."
        );
      }
    } catch (err: any) {
      console.log(err);
      if (
        err.response.status === 409 &&
        err.response.data.message === "account already exist"
      ) {
        return alert("이미 해당 아이디로 가입된 계정이 존재합니다.");
      }
      if (
        err.response.status === 409 &&
        err.response.data.message === "email already exist"
      ) {
        return alert("이미 해당 이메일로 가입된 계정이 존재합니다.");
      }
      return alert("페이지가 원활하지 않습니다.\n잠시 후 다시 이용해주세요.");
    }
  };

  // 유효성검사
  const joinValidation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /**
     * idChecker = 영문 필수, 숫자 허용, 특수기호(_ 만 허용) 최소 4글자  ~ 최대 12글자
     * pwChecker = 영문 대, 소문자 + 숫자 + 특수기호 ( _,!,@,#,$,(,),%,^ 만 허용) 포함하여 최소 8자 ~ 최대 20자
     * nameChecker = 한글,영문 혼용 불가능. 한글, 영문 사용 가능 2~10글자
     * pwFirstString = PW 첫글자
     *
     * 기본적으로 input element에서 min, maxLength로 길이 제한 중
     */
    const idChecker = /^[A-Za-z\d\_]{4,12}$/;
    const pwChecker = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[_!@#$()%^]).{8,20}$/;
    const nameChecker = /^[가-힣]{2,10}|\s[a-zA-Z]{2,10}|[a-zA-Z]{2,10}$/;
    const pwFirstString = reqBody.Data.password[0];

    /**
     * 가입정보 중 하나라도 비어있을 경우 알림 및 동작 중단
     */
    if (
      reqBody.Data.account === "" ||
      reqBody.Data.password === "" ||
      reqBody.Data.checkUserPw === "" ||
      reqBody.Data.name === "" ||
      reqBody.Data.email === ""
    ) {
      return alert("비어있는 항목이 있습니다.\n 다시 확인 해주세요.");
    }

    /**
     * 규칙에 따른 유효성 검사
     * 성공 시 JoinEvent 시작
     */
    if (
      idChecker.test(reqBody.Data.account) &&
      pwChecker.test(reqBody.Data.password) &&
      nameChecker.test(reqBody.Data.name) &&
      pwFirstString === pwFirstString.toUpperCase() &&
      checkPwComment === null
    ) {
      return requestAction();
    }

    /**
     * 유효성 검사 실패 시 유저에게 보여줄 메시지
     */
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
    if (reqBody.Data.password !== reqBody.Data.checkUserPw) {
      return setCheckPwComment(<p>재확인 암호가 일치하지 않습니다.</p>);
    }
    return setCheckPwComment(null);
  }, [reqBody.Data.password, reqBody.Data.checkUserPw]);

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
                reqBody.Data.password,
                reqBody.Data.checkUserPw,
                reqBody.Data.name,
                reqBody.Data.email
              )
            );
          }}
          value={reqBody.userId}
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
                reqBody.Data.account,
                e.target.value,
                reqBody.Data.checkUserPw,
                reqBody.Data.name,
                reqBody.Data.email
              )
            );
          }}
          value={reqBody.userPw}
          minLength={8}
          maxLength={20}
        />
        <input
          type="password"
          className={style.join_input}
          name="checkUserPw"
          placeholder="암호를 한번 더 입력하세요."
          onChange={(e) => {
            setReqBody(
              new JoinRequestDto(
                reqBody.Data.account,
                reqBody.Data.password,
                e.target.value,
                reqBody.Data.name,
                reqBody.Data.email
              )
            );
          }}
          value={reqBody.checkUserPw}
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
                reqBody.Data.account,
                reqBody.Data.password,
                reqBody.Data.checkUserPw,
                e.target.value,
                reqBody.Data.email
              )
            );
          }}
          value={reqBody.userName}
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
                reqBody.Data.account,
                reqBody.Data.password,
                reqBody.Data.checkUserPw,
                reqBody.Data.name,
                e.target.value
              )
            );
          }}
          value={reqBody.userEmail}
        />
        <input type="submit" className={style.join_submit} value="회원가입" />
        {validationComment}
      </form>
      {userDatas}
    </div>
  );
}
