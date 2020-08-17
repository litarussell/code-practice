const t = require('@babel/types')
const babylon = require('@babel/parser')
const traverse = require("@babel/traverse").default
const generate = require("@babel/generator").default

const enter = require('./index')

console.log(enter);

const code = `
  const test = require('test')
`
const Ast = babylon.parse(code, {
  sourceType: "module",
  //plugins: ["exportDefaultFrom"] //这里是要用到的插件，文中插件未用到
})

traverse(Ast, {
  enter(path) {
    if(path.node.type === 'CallExpression' && path.node.callee.name == "require"){
      //判断require是否本身包含default
      if(!(path.parentPath.node.type === 'MemberExpression' && path.parentPath.node.property.name === 'default')) {
        // t.memberExpression(object, property, computed, optional)
        const node_new = t.memberExpression(
          t.callExpression(
            t.identifier('request'),
            [t.identifier(`'${path.node.arguments[0].value}'`)]
          ),
          t.identifier('default')
        )
        path.replaceWith(node_new)
      }
    }
  }
})

const result = generate(Ast, {
  retainLines: false,
  compact: "auto",
  concise: false,
  quotes: "double",
}, code)

console.log(result)