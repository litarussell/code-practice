import * as React from 'react'

const { useState, useEffect, useReducer, useContext, createContext } = React

/**
 * useReducer()
 */
const initState = { count: 0 }
function reducer(state, action) {
    switch (action.type) {
        case 'add': return { count: state.count + 1 }
        case 'decrement': return { count: state.count - 1 }
        default: throw new Error()
    }
}
// 使用reducer的hooks函数的组件
function ReducerHooks(props) {
    const [state, dispatch] = useReducer(reducer, initState)
    return (
        <div>
            <span>count: {state.count}</span>
            <button onClick={() => dispatch({ type: 'add' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        </div>
    )
}

/**
 * 自定义hook, 不同的组件使用相同的hook不会共享state, 其state和effect是相互隔离的
 */
function useTestState() {
    const [Test, setTest] = useState(0)
    useEffect(() => {
        console.log('自定义Hook')
        return () => {
            console.log('自定义hook 消除')
        }
    })
    return Test
}

/**
 * 
 */
const AppContext = createContext('test')
const A = () => {
    const test = useContext(AppContext)
    return (
        <div>
            <h1>A:</h1>
            <p>{test}</p>
        </div>
    )
}
const B = () => {
    const test = useContext(AppContext)
    return (
        <div>
            <h1>B:</h1>
            <p>{test}</p>
        </div>
    )
}
const ContextComponent = () => {
    return (
        <AppContext.Provider value={'testUseComtext'}>
            <A />
            <B />
        </AppContext.Provider>
    )
}


export function HooksTest() {
    const [count, setCount] = useState(0)
    const [test, setTest] = useState(1)
    const flag = useTestState()
    // 相当于componentDidMount和componentDidUpgrade
    // Effect在每次渲染的时候都会执行, 该函数会在组件销毁或后续渲染时重新执行
    // 第二个参数如果传入一个空数组[], effect仅会在组件挂载和卸载时执行
    useEffect(() => {
        document.title = `点击次数: ${count}!`
        console.log('effect', count)
        // 可返回一个函数, 做一些清除操作, 执行当前effect之前会对上一个effect进行清除
        return () => {
            console.log('清除', count)
        }
    }, [count])

    useEffect(() => {
        console.log('test->', test)
        return () => {
            console.log('清除test->', test)
        }
    }, [test])

    useEffect(() => {
        console.log('挂载执行!')
        return () => {
            console.log('卸载执行!')
        }
    }, [])
    return (
        <div>
            <p>点击次数: {count} 次！test: {test} flag: {flag}</p>
            <button onClick={() => setCount(count + 1)}>count点击</button>
            <button onClick={() => { setTest(test << 1) }}>test点击</button>
            <ReducerHooks />
            <ContextComponent />
        </div>
    )
}
