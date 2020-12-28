import * as React from 'react'
import { BrowserRouter as Router, Route, Link, Switch, useRouteMatch } from "react-router-dom"

const { useRef, useEffect, useState } = React;

export default () => {
  return (
    <Router basename="/test">
      <div>
        <ul>
          <li><Link to={{ pathname: "/挂载测试", state: { test: "hello" } }}>挂载测试</Link></li>
          <li><Link to="/Context测试">Context测试</Link></li>
          <li><Link to="/Render测试">Render测试</Link></li>
          <li><Link to="/Ref测试">Ref测试</Link></li>
          <li><Link to="/Effect测试">Effect测试</Link></li>
        </ul>

        <hr />
        <Switch>
          <Route path="/挂载测试" component={TestComponentDidMount} />
          <Route path="/Context测试" component={TestContext} />
          <Route path="/Render测试" component={TestRender} />
          <Route path="/Ref测试" component={TestRef} />
          <Route path="/Effect测试" component={TestEffect} />
        </Switch>
      </div>
    </Router>
  );
}

// 
const TestEffect = () => {
  return <div>TestEffect</div>
}

// 
const TestRef = () => {
  const counter = useRef(0);
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // 当组件重新渲染时，counter 值增加
    counter.current = counter.current + 1;
    console.log('ref', counter.current);
  }); 
  
  return (
    <>
      <h1>{`The component has been re-rendered ${counter.current} times, count: ${count}`}</h1>
      <button onClick={() => setCount(pre => pre + 1)}>更新</button>
    </>
    
  );
};

// 
function Son() {
  console.log('child render!');
  return <div>Son</div>;
}
function Parent(props) {
  const [count, setCount] = React.useState(0);

  return (
    <div onClick={() => {setCount(count + 1)}}>
      count:{count}
      {props.children}
    </div>
  );
}
function TestRender() {
  return (
    <Parent>
      <Son/>
    </Parent>
  );
}

// 
class TestComponentDidMount extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  componentDidMount() {
    console.log('--componentDidMount--')
    // setTimeout(() => this.count++, 1000)
    console.time('time')
    for (let i = 0; i < 1000000000; i++) { }
    console.timeEnd('time')
    //   this.setState({
    //     count: 1
    //   })
  }
  render() {
    console.log(this.state.count)
    return <div>count: {this.state.count}</div>
  }
}

// 
const ValueContext = React.createContext('test')

class A extends React.Component<any, any> {
  static contextType = ValueContext
  componentDidMount() {
    console.log('--componentDidMount-- A')
  }
  componentDidUpdate (prevProps: any, prevState: any, snapshot) : void {
    console.log('--componentDidUpdate-- A', prevProps, prevState, snapshot)
  }
  render() {
    console.log('--render-- A')
    return (
      <div>A: {this.context}</div>
    );
  }
}
class B extends React.Component<any, any> {
  componentDidMount() {
    console.log('--componentDidMount-- B')
  }
  componentDidUpdate (prevProps: any, prevState: any, snapshot) : void {
    console.log('--componentDidUpdate-- B', prevProps, prevState, snapshot)
  }
  render() {
    console.log('--render-- B')
    return (
      <div>B: Test</div>
    );
  }
}

class TestContext extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  render() {
    return (
      <>
        <button onClick={() => this.setState({count: this.state.count + 1})}>change</button>
        <ValueContext.Provider value="1">
          <A />
          <B />
        </ValueContext.Provider>
      </>
    );
  }
}