import * as React from "react"
import * as ReactDOM from "react-dom"
import { extend } from "vue/types/umd";

import './app.less'

import App from './route'

// class App extends React.Component<any, any> {
//   constructor(props) {
//     super(props)
//     this.state = {
//       count: 0
//     }
//   }
//   componentDidMount() {
//     console.log('mounted')
//     // setTimeout(() => this.count++, 1000)
//     console.time('time')
//     for (let i = 0; i < 10000000000; i++){}
//     console.timeEnd('time')
//     this.setState({
//       count: 1
//     })
//   }
//   render() {
//     console.log(this.state.count)
//     return <div>count: {this.state.count}</div>
//   }
// }


ReactDOM.render(
  <App />,
  document.querySelector("#app")
);