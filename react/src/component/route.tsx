import * as React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

function BasicExample() {
  return (
    <Router basename="/路由">
      <div>
        <ul>
          <li><Link to={{ pathname: "/页面传参", state: { test: "hello" } }}>页面传参</Link></li>
          <li><Link to="/嵌套路由">嵌套路由</Link></li>
        </ul>

        <hr />

        <Route path="/页面传参" component={Home} />
        <Route path="/嵌套路由" component={Topics} />
      </div>
    </Router>
  );
}

function Home(props) {
  console.log(props)
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route exact path={match.path} render={() => <h3>Please select a topic.</h3>} />
    </div>
  );
}

function Topic({ match }) {
  return (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  );
}

export default BasicExample;
