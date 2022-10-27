import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import style from "../../styles/join.module.css";

export default function Join() {
  // Join 입력값
  const [reqBody, setReqBody] = useState({
    userId: "",
    userPw: "",
    checkUserPw: "",
    userName: "",
    userEmail: "",
  });

  // 유효성검사 메시지
  const [validationComment, setValidationComment] =
    useState<ReactElement | null>(null);

  // 암호 재확인 메시지
  const [checkPwComment, setCheckPwComment] = useState<ReactElement | null>(
    null
  );

  // Input onchange
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = {
      ...reqBody,
      [name]: value,
    };

    setReqBody(newValue);
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
    const pwFirstString = reqBody.userPw[0];

    /**
     * 가입정보 중 하나라도 비어있을 경우 알림 및 동작 중단
     */
    if (
      reqBody.userId === "" ||
      reqBody.userPw === "" ||
      reqBody.userName === "" ||
      reqBody.userEmail === ""
    ) {
      return alert("비어있는 항목이 있습니다.\n 다시 확인 해주세요.");
    }

    /**
     * 규칙에 따른 유효성 검사
     * 성공 시 JoinEvent 시작
     */
    if (
      idChecker.test(reqBody.userId) &&
      pwChecker.test(reqBody.userPw) &&
      nameChecker.test(reqBody.userName) &&
      pwFirstString === pwFirstString.toUpperCase() &&
      checkPwComment === null
    ) {
      return console.log("유효성검사 통과");
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
    if (reqBody.userPw !== reqBody.checkUserPw) {
      return setCheckPwComment(<p>재확인 암호가 일치하지 않습니다.</p>);
    }
    return setCheckPwComment(null);
  }, [reqBody.checkUserPw, reqBody.userPw]);

  return (
    <div className={style.container}>
      <h1>Join</h1>
      <form className={style.join_form} onSubmit={joinValidation}>
        <input
          type="text"
          className={style.join_input}
          name="userId"
          placeholder="아이디를 입력하세요."
          onChange={onChangeHandler}
          value={reqBody.userId}
          minLength={4}
          maxLength={12}
        />
        <input
          type="password"
          className={style.join_input}
          name="userPw"
          placeholder="암호를 입력하세요."
          onChange={onChangeHandler}
          value={reqBody.userPw}
          minLength={8}
          maxLength={20}
        />
        <input
          type="password"
          className={style.join_input}
          name="checkUserPw"
          placeholder="암호를 한번 더 입력하세요."
          onChange={onChangeHandler}
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
          onChange={onChangeHandler}
          value={reqBody.userName}
          minLength={2}
          maxLength={10}
        />
        <input
          type="email"
          className={style.join_input}
          name="userEmail"
          placeholder="이메일을 입력하세요."
          onChange={onChangeHandler}
          value={reqBody.userEmail}
        />
        <input type="submit" className={style.join_submit} value="회원가입" />
        {validationComment}
      </form>
    </div>
  );
}
