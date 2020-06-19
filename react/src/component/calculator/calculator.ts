const Cal = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
  '%': (a: number, b: number) => a % b
}

// 字符串解析
export default class Calculator {
  private str: string = null
  private st: Array<string> = [] // 逆波兰式

  constructor(str: string) {
    this.str = str
  }
  tree () {
    return this
  }
  // 使用双栈解析表达式
  stack () {
    let s1: Array<string> = [] // 运算符栈
    let s = this.str
    for (let i = 0, j = 0; i < s.length; ) {
      // 处理数字 符号
      // 符号栈入栈元素的优先级 > 栈顶元素的优先级: 直接入栈
      // 入栈元素优先级 <= 栈顶元素优先级: 弹栈运算符到运算栈st
      if (j < s.length && ( s[j] === '.' || !Number.isNaN(Number(s[j])) )) {
        j++
        continue
      } else {
        if (i < j) {
          let num = s.slice(i, j)
          let sign = s[j]
          this.st.push(num)
          if (sign === ')') {
            while (s1.length) {
              let k = s1.pop()
              if (k === '(') break
              this.st.push(k)
            }
          } else if (s1.length > 0 && sign) {
            let p = s1[s1.length - 1] // 运算符栈顶符号
            if (sign === '+' || sign === '-') {
              // 优先级较低的运算符 + - ; // 运算符栈弹栈
              while (s1.length) {
                if (s1[s1.length - 1] === '(') break
                this.st.push(s1.pop())
              }
            } else if (p === '*' || p === '/' || p === '%') {
              // 优先级较高的运算符 * / % ;弹栈直到栈顶元素优先级 < 将要入栈的运算符优先级
              while (s1.length) {
                this.st.push(s1.pop())
                let p1 = s1[s1.length - 1]
                if (p1 === '+' || p1 === '-' || p1 === '(') break
              }
            }
            s1.push(sign)
          } else {
            if (sign) s1.push(sign)
          }
        } else {
          let sign = s[j] // 运算符 括号
          if (sign) s1.push(sign)
        } 
        i = ++j
      }
    }
    while (s1.length) this.st.push(s1.pop())
    return this
  }
  exec () {
    console.log('逆波兰式:', this.st)
    let s: Array<number> = []
    try {
      for (let i = 0; i < this.st.length; i++) {
        let p = this.st[i]
        let num = Number(p)
        if ( !Number.isNaN(num) ) s.push(num)
        else {
          let b = s.pop()
          let a = s.pop()
          if (!(p in Cal)) throw new Error(`表达式错误: ${p}`)
          s.push(Cal[p](a, b))
        }
      }
      return s[0]
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export function parse (str: string) {
  return new Calculator(str).stack()
}

export function exec (str: string) {
  return parse(str).exec()
}

