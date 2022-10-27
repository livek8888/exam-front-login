import { useState } from "react";
import style from "../../styles/join.module.css";

export default function Join() {
  const [reqBody, setReqBody] = useState({
    userId: "",
    userPw: "",
    checkUserPw: "",
    userName: "",
    userEmail: "",
  });

  const [validationComment, setValidationComment] = useState(null);

  const [checkPwComment, setCheckPwComment] = useState(null);

  return (
    <div className={style.container}>
      <h1>Join</h1>
      <form className={style.join_form}>
        <input
          type="text"
          className={style.join_input}
          name="userId"
          placeholder="아이디를 입력하세요."
          // onChange={}
          value={reqBody.userId}
        />
        <input
          type="password"
          className={style.join_input}
          name="userPw"
          placeholder="암호를 입력하세요."
          // onChange={}
          value={reqBody.userPw}
        />
        <input
          type="password"
          className={style.join_input}
          name="checkUserPw"
          placeholder="암호를 한번 더 입력하세요."
          // onChange={}
          value={reqBody.checkUserPw}
        />
        {checkPwComment}
        <input
          type="text"
          className={style.join_input}
          name="name"
          placeholder="이름을 입력하세요."
          // onChange={}
          value={reqBody.userName}
        />
        <input
          type="email"
          className={style.join_input}
          name="name"
          placeholder="이메일을 입력하세요."
          // onChange={}
          value={reqBody.userEmail}
        />
        <input type="submit" className={style.join_submit} value="회원가입" />
        {validationComment}
      </form>
    </div>
  );
}
