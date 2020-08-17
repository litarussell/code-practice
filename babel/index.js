const t = require('@babel/types')

function enter(path) {
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

const visitor = {
  CallExpression: {
    enter,
    exit() {
      console.log("------ Exited ------");
    }
  }
}

exports.enter = enter

module.exports = function () {
  return {
    visitor
  }
}


