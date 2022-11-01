// const store = createStore(reducer);
interface IJoinReq {
  account: string;
  password: string;
  passwordCheck: string;
  name: string;
  email: string;
}

interface IJoinRes {
  id: number;
  account: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

// interface IState {
//   JoinRequestData: Object | undefined;
//   JoinResponseData: Object | undefined;
// }

// interface IAction {
//   type: string;
//   data?: Object;
// }

export default function Reducer(currentState: any, action: any) {
  if (currentState === undefined) {
    return {
      JoinRequestData: <IJoinReq>{
        account: "",
        password: "",
        passwordCheck: "",
        name: "",
        email: "",
      },
      JoinResponseData: <IJoinRes>{
        id: 0,
        account: "",
        name: "",
        email: "",
        created_at: new Date(),
        updated_at: new Date(),
      },
    };
  }
  console.log(action);

  const newState = { ...currentState };
  if (action.type === "VALUE_CHANGE") {
    newState.JoinRequestData = action.data;
  } else if (action.type === "RESPONSE") {
    newState.JoinResponseData = action.data;
  }

  return newState;
}
