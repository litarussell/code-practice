import * as React from "react"
import * as ReactDOM from "react-dom"
import { extend } from "vue/types/umd";

import './app.less'

import App from './route'

ReactDOM.render(
  <App />,
  document.querySelector("#app")
);