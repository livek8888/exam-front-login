import axios from "axios";
import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import InputComponent from "../../components/InputComponent";
import style from "../../styles/join.module.css";

export default function Join() {
  // React-redux
  const JoinInputData = useSelector((state: any) => state.JoinRequestData);
  const dispatch = useDispatch();
  console.log(JoinInputData);

  // 유효성검사 메시지
  const [validationComment, setValidationComment] =
    useState<ReactElement | null>(null);

  // 암호 재확인 메시지
  const [checkPwComment, setCheckPwComment] = useState<ReactElement | null>(
    null
  );

  // Response값 화면에 표시할 String State
  const [userDatas, setUserDatas] = useState<string | null>(null);

  // 회원가입 서버 통신
  const requestAction = async () => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "api/user",
        JoinInputData
      );
      if (res.status === 201) {
        dispatch({ type: "RESPONSE", data: res });
        setUserDatas(
          `Hi!, 아이디: ${JoinInputData.account}, 비밀번호: ${JoinInputData.password}, 이름: ${JoinInputData.name}, 이메일: ${JoinInputData.email}`
        );
        return alert(
          "회원가입 성공 \n" + JoinInputData.name + " 님 반갑습니다."
        );
      }
    } catch (err: any) {
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
    const pwFirstString = JoinInputData.password[0];

    if (
      JoinInputData.account === "" ||
      JoinInputData.password === "" ||
      JoinInputData.passwordCheck === "" ||
      JoinInputData.name === "" ||
      JoinInputData.email === ""
    ) {
      return alert("비어있는 항목이 있습니다.\n 다시 확인 해주세요.");
    }

    if (
      idChecker.test(JoinInputData.account) &&
      pwChecker.test(JoinInputData.password) &&
      nameChecker.test(JoinInputData.name) &&
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
    if (JoinInputData.password !== JoinInputData.passwordCheck) {
      return setCheckPwComment(<p>재확인 암호가 일치하지 않습니다.</p>);
    }
    return setCheckPwComment(null);
  }, [JoinInputData.password, JoinInputData.passwordCheck]);

  // handle value
  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = { ...JoinInputData, [name]: value };
    dispatch({ type: "VALUE_CHANGE", data: newValue });
  };

  return (
    <div className={style.container}>
      <h1>Join</h1>
      <form className={style.join_form} onSubmit={joinValidation}>
        <InputComponent
          type="text"
          name="account"
          holdStr="아이디를 입력하세요."
          onChange={handleValue}
          value={JoinInputData.account}
          length={{ min: 4, max: 12 }}
        />
        <InputComponent
          type="password"
          name="password"
          holdStr="암호를 입력하세요."
          onChange={handleValue}
          value={JoinInputData.password}
          length={{ min: 8, max: 20 }}
        />
        <InputComponent
          type="password"
          name="passwordCheck"
          holdStr="암호를 한번 더 입력하세요."
          onChange={handleValue}
          value={JoinInputData.passwordCheck}
          length={{ min: 8, max: 20 }}
        />
        {checkPwComment}
        <InputComponent
          type="text"
          name="name"
          holdStr="이름을 입력하세요."
          onChange={handleValue}
          value={JoinInputData.name}
          length={{ min: 2, max: 10 }}
        />
        <InputComponent
          type="email"
          name="email"
          holdStr="이메일을 입력하세요."
          onChange={handleValue}
          value={JoinInputData.email}
        />
        <input type="submit" className={style.join_submit} value="회원가입" />
        {validationComment}
      </form>
      {userDatas}
    </div>
  );
}
