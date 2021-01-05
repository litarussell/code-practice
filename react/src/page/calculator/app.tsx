import * as React from "react"
import { parse, exec } from './calculator'
import './app.less'

export default class Calculator extends React.Component {
  private str: string = ''
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.display = this.display.bind(this)
  }
  handleClick (e) {
    const { dataset: { num }, id } = e.target
    // this.display()
    console.log(num, id)
    this.test(num, id)
  }
  display (flag, text) {

  }
  render () {
    return (
      <div className="constructor">
        <div className="show">
          <div className="display"></div>
          <div className="result"></div>
        </div>
        <div className="btn" onClick={this.handleClick}>
          <div className="item" id="CLEAR">C</div>
          <div className="item" id="LEFT">(</div>
          <div className="item" id="RIGHT">)</div>
          <div className="item" id="MOD">%</div>
          <div className="item" id="BACK">&#60;-</div>
          <div className="item" data-num="1">1</div>
          <div className="item" data-num="2">2</div>
          <div className="item" data-num="3">3</div>
          <div className="item" id="ADD">+</div>
          <div className="item" id="SUB">-</div>
          <div className="item" data-num="4">4</div>
          <div className="item" data-num="5">5</div>
          <div className="item" data-num="6">6</div>
          <div className="item" id="DIV">/</div>
          <div className="item" id="MUL">*</div>
          <div className="item" data-num="7">7</div>
          <div className="item" data-num="8">8</div>
          <div className="item" data-num="9">9</div>
          <div className="item" id="EXEC">=</div>
          <div className="item" data-num="0">0</div>
          <div className="item" id="POINT">.</div>
        </div>
      </div>
    )
  }
  test (num, id) {
    if (id === 'CLEAR') {
      this.str = ''
      return
    }
    if (num !== undefined) {
      this.str += String(num)
      return
    }
    switch (id) {
      case 'DIV': return this.str += '/'
      case 'MUL': return this.str += '*'
      case 'MOD': return this.str += '%'
      case 'ADD': return this.str += '+'
      case 'SUB': return this.str += '-'
      case 'LEFT': return this.str += '('
      case 'RIGHT': return this.str += ')'
      case 'POINT': return this.str += '.'
      case 'EXEC':
        // this.str = '(((10+2)*2+6)/2)%4-1'
        let re = exec(this.str)
        console.log(this.str, '=', re)
    }
  }
}