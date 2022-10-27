import { ChangeEvent, ReactElement, useEffect, useState } from "react";
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
      <form className={style.join_form}>
        <input
          type="text"
          className={style.join_input}
          name="userId"
          placeholder="아이디를 입력하세요."
          onChange={onChangeHandler}
          value={reqBody.userId}
        />
        <input
          type="password"
          className={style.join_input}
          name="userPw"
          placeholder="암호를 입력하세요."
          onChange={onChangeHandler}
          value={reqBody.userPw}
        />
        <input
          type="password"
          className={style.join_input}
          name="checkUserPw"
          placeholder="암호를 한번 더 입력하세요."
          onChange={onChangeHandler}
          value={reqBody.checkUserPw}
        />
        {checkPwComment}
        <input
          type="text"
          className={style.join_input}
          name="userName"
          placeholder="이름을 입력하세요."
          onChange={onChangeHandler}
          value={reqBody.userName}
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
