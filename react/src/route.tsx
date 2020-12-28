import * as React from 'react'
import { Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom'

import {
  Lifecycle,
  route,
  redux,
  reactRedux,
  HooksTest,
  Calculator,

  Test,
  Better
} from "./component"

// let props = {flag: false, test: false}

export default () => {
  return (
    <Router>
      <div className="slider">
        <ul>
          <li><Link to="/生命周期函数">React 生命周期函数</Link></li>
          <li><Link to="/路由">路由</Link></li>
          <li><Link to="/redux">redux</Link></li>
          <li><Link to="/react-redux">react-redux</Link></li>
          <li><Link to="/hooks">hooks</Link></li>
          <li><Link to="/calculator">Calculator</Link></li>
          <li><Link to="/test">测试</Link></li>
          <li><Link to="/better">性能优化</Link></li>
        </ul>
      </div>
      <div className="content">
        <Switch>
          <Route path="/" exact render={props => {
            console.log(props)
            return (
              <div>
                <span>react学习</span>
              </div>
            )}
          } />
          <Route path="/生命周期函数" exact component={Lifecycle} />
          <Route path="/路由" component={route} />
          <Route path="/redux" component={redux} />
          <Route path="/react-redux" component={reactRedux} />
          <Route path="/hooks" component={HooksTest} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/test" component={Test} />
          <Route path="/better" component={Better} />
          <Route render={() => (<span>404</span>)} />
        </Switch>
      </div>
    </Router>
  )
}
