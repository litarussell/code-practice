import * as React from 'react';
import {
  Route,
  Redux,
  Lifecycle,
  ReactMobx,
  HooksTest,
  ReactRedux,
  Calculator,
  VirtualList,

  Test,
  Better
} from "../page";

export default [
  {
    name: 'React 生命周期函数',
    exact: true,
    path: '/生命周期函数',
    component: Lifecycle
  },
  {
    name: 'React 路由',
    path: '/路由',
    component: Route
  },
  {
    name: 'Redux',
    path: '/redux',
    component: Redux
  },
  {
    name: 'React-Redux',
    path: '/react-redux',
    component: ReactRedux
  },
  {
    name: 'React Hooks',
    path: '/hooks',
    component: HooksTest
  },
  {
    name: 'React Mobx',
    path: '/react-mobx',
    component: ReactMobx
  },
  {
    name: 'React 性能优化',
    path: '/better',
    component: Better
  },
  {
    name: 'React 测试',
    path: '/test',
    component: Test
  },
  {
    name: '计算器',
    path: '/calculator',
    component: Calculator
  },
  {
    name: '虚拟列表',
    path: '/vistual-list',
    component: VirtualList
  },
];