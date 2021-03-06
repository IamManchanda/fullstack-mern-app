import React from "react";
import { render } from "react-dom";
import App from "./app";
import * as serviceWorker from "./serviceWorker";

/* eslint-disable no-extend-native */
Number.prototype[Symbol.iterator] = function* () {
  for (let i = 1; i <= this; i += 1) {
    yield i;
  }
};
/* eslint-enable */

render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
