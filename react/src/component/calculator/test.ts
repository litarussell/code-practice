import { parse, exec } from './calculator'

let re = parse('1+2*3')
// let r = exec('1+(1.5+1.5)*3')

console.log(re)
// console.log(r)