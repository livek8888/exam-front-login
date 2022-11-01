import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Reducer from "../public/Reducer";

function MyApp({ Component, pageProps }: AppProps) {
  const store = createStore(Reducer);

  return (
    <Provider store={store}>
      <Header />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
