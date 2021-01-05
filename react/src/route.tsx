import * as React from 'react'
import { Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom'

import routers from './router';

// let props = {flag: false, test: false}

export default () => {
  return (
    <Router>
      <div className="slider">
        <ul>
          {routers.map(item => {
            return <li key={item.path}><Link to={item.path}>{item.name}</Link></li>
          })}
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
          {routers.map(item => {
            return <Route key={item.path} path={item.path} exact={!!item.exact} component={item.component} />
          })}
          <Route render={() => (<span>404</span>)} />
        </Switch>
      </div>
    </Router>
  )
}
