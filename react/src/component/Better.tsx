import * as React from 'react';

const { useState } = React;

const Child1 = ({ name }) => {
  console.log('Child1 render')
  return <span>{name}</span>
}
const Child2 = React.memo(Child1)


class Child3 extends React.Component<any, any> {
  shouldComponentUpdate (nextProps: any, nextState: any): boolean {
    return nextProps.name !== this.props.name
  }
  render() {
    console.log('Child2 render');
    const { name } = this.props;
    return <span>{name}</span>
  }
  
}

class Child4 extends React.PureComponent<any, any> {
  render() {
    console.log('Child3 render');
    const { name } = this.props;
    return <span>{name}</span>
  }
  
}

export default () => {
  const [name, setName] = useState('lita');
  const [count, setCount] = useState(0);

  return (
    <>
      <div onClick={() => setCount(pre => pre + 1)}>count: {count}</div>
      <Child1 name={name} />
      <Child2 name={name} />
      <Child3 name={name} />
      <Child4 name={name} />
    </>
  )
}
