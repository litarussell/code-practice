>## 生命周期函数
#### 挂载组件时的调用顺序
* `constructor()`
* `static getDerivedStateFromProps()` : 静态方法, 在render方法之前调用, 用于更新state, 返回null则不更新
* `render()`
* `componentDidMount()`

#### 更新组件时的调用顺序
* `static getDerivedStateFromProps()`
* `shouldComponentUpdate(nextProps, nextState)` : 默认返回`true`, 如果返回`false`则跳过更新; 首次渲染和调用`forceUpdate()`时不会调用该方法
* `render()`
* `getSnapshotBeforeUpdate(prevProps, prevState)` : 在重渲染之前获取Dom快照, 可以在组件发生更改之前捕获到一些信息, 返回值作为componentDidUpdate()的参数
* `componentDidUpdate(prevProps, prevState, snapshot)`: 更新后立即调用, 首次不会调用
