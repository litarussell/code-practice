import * as React from "react"

interface AppProps { flag: boolean; }
interface AppState { test: boolean; }

export default class Lifecycle extends React.Component<AppProps, AppState> {
  // 静态属性, 用于设置默认的props
  static defaultProps: {}
  // 静态方法, 在render方法之前调用, 用于更新state, 返回null则不更新
  static getDerivedStateFromProps: (props: AppProps, state: AppState) => AppState
  // 静态方法, 错误处理, 返回值更新state
  static getDerivedStateFromError: (error: any) => AppState
  constructor (props: AppProps) {
    console.log('--constructor--')
    super(props)
    this.state = {
      test: false
    }
  }
  render ()  {
    console.log('--render--')
    let test = this.state.test
    return (
      <div>
        <span>{test.toString()}</span>
        <button onClick={this.handleClick.bind(this)}>触发</button>
      </div>
    )
  }
  // 默认返回`true`, 如果返回`false`则跳过更新; 首次渲染和调用`forceUpdate()`时不会调用该方法
  shouldComponentUpdate (nextProps: any, nextState: any): boolean {
    console.log('--shouldComponentUpdate--', nextProps, nextState)
    return true
  }
  // 在重渲染之前获取Dom快照, 可以在组件发生更改之前捕获到一些信息, 返回值作为componentDidUpdate()的参数
  getSnapshotBeforeUpdate (prevProps: AppProps, prevState: AppState) {
    console.log('--getSnapshotBeforeUpdate--')
    return 'test'
  }
  
  componentDidMount (): void {
    console.log('--componentDidMount--', this.props, this.state)
    // throw Error('error test')
  }
  componentDidUpdate (prevProps: AppProps, prevState: AppState, snapshot) : void {
    console.log('--componentDidUpdate--', prevProps, prevState, snapshot)
  }
  componentWillUnmount (): void {
    console.log('--componentWillUnmount--')
  }
  // 渲染过程、生命周期、子组件构造函数抛出错误
  componentDidCatch (error, info) {
    console.log('--componentDidCatch--', error, info)
  }

  handleClick () {
    this.setState({
      test: !this.state.test
    })
  }
}

Lifecycle.defaultProps = {
  flag: false
}
Lifecycle.getDerivedStateFromProps = function (props: AppProps, state: AppState): AppState  {
  console.log('--static getDerivedStateFromProps--', props, state)
  return null
}
Lifecycle.getDerivedStateFromError = function (error: any): AppState {
  console.log('--static getDerivedStateFromError--', error)
  return { test: true }
}
