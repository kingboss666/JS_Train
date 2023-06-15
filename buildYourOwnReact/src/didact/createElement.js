/** 生成 react element (包含节点信息的对象) */
function createElement(type, props, ...children) {
  // 使用 ... 操作符确保参数永远是数组
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => (typeof child === 'object' ? child : createTextElement(child)))
    }
  }
}

/** 处理非对象element */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

export { createElement }
