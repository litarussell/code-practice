const t = require('@babel/types')
const babylon = require('@babel/parser')
const traverse = require("@babel/traverse").default
const generate = require("@babel/generator").default

const enter = require('./index')

console.log(enter);

const code = `obj?.a?.b`

const Ast = babylon.parse(code, {
  sourceType: "module",
})

// const transCondition = ({ node, path }) => {
//   if (node.type !== 'OptionalMemberExpression') {
//     return node
//   }

//   const exp = transCondition(node.object)

//   return t.conditionalExpression(
//     t.logicalExpression(
//       '||',
//       t.binaryExpression('===', exp, t.nullLiteral()),
//       t.binaryExpression('===', exp, t.unaryExpression('void', t.numericLiteral(0)))
//     ),  // 逻辑表达式构造
//     t.unaryExpression('void', t.numericLiteral(0)), // 一元表达式构造
//     t.memberExpression(exp, node.property, node.computed, node.optional)  // 成员访问表达式构造
//   )
// }

const transCondition = ({ node, path, variabelList = [], expression = null }) => {
  if (!node) {
    return expression
  }
  if (!node.optional) {
    return transCondition({
      node: node.object,
      path,
      expression,
      variabelList,
      memberExpression: memberExpression.concat(node)
    })
  }

  const exp = transCondition(node.object)

  const res = t.conditionalExpression(
    t.logicalExpression(
      '||',
      t.binaryExpression('===', exp, t.nullLiteral()),
      t.binaryExpression('===', exp, t.unaryExpression('void', t.numericLiteral(0)))
    ),  // 逻辑表达式构造
    t.unaryExpression('void', t.numericLiteral(0)), // 一元表达式构造
    t.memberExpression(exp, node.property, node.computed, node.optional)  // 成员访问表达式构造
  )

  if (node.object.object) {
    return transCondition({ node: node.object, path, expression: res, variabelList })
  }

  path.insertBefore(t.variableDeclaration('var', variabelList))  // 创建额外变量

  return res
}

traverse(Ast, {
  OptionalMemberExpression(path) {
    path.replaceWith(transCondition({ node: path.node, path }))
  }
})

const result = generate(Ast, {
  retainLines: false,
  compact: "auto",
  concise: false,
  quotes: "double",
}, code)

console.log(result.code)