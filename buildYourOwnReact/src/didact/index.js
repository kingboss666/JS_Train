import { createElement } from './createElement'
import { reconcileChildren } from './reconcile'

const isEvent = (key) => key.startsWith('on')
const isNew = (prev, next) => (key) => prev[key] !== next[key]
const isGone = (prev, next) => (key) => !(key in next)
/** 过滤事件属性 和 children */
const isProperty = (key) => key !== 'children' && !isEvent(key)

/** 生成 DOM Node (最终生成的真实 DOM 节点 ) */
function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)

  updateDom(dom, {}, fiber.props)
  return dom
}

/** 更新 DOM Node */
function updateDom(dom, prevProps, nextProps) {
  // 移除 旧的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // 删除旧属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = ''
    })

  // 添加新的事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })

  // 设置新属性 或 更新属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => (dom[name] = nextProps[name]))
}

/** 移除 DOM Node */
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    // 如果当前 fiber节点没有dom 向下到找到第一个有 dom 的fiber节点
    commitDeletion(fiber.child, domParent)
  }
}

/** 将 fiber 树递归渲染到 DOM */
function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  // 将指针指向渲染好的 DOM 树
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) return

  // 如果父 fiber 节点没有 dom, 向上遍历到有 dom 的 fiber 节点
  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
  // TODO 处理需要变动的 fiber
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function render(element, container) {
  // TODO 设置fiber树根节点
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
let deletions = null

/**
 * 将任务拆成小块，让高优先级的先更新（可中断渲染）
 */
function workLoop(deadline) {
  let shouldYieId = false
  while (nextUnitOfWork && !shouldYieId) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYieId = deadline.timeRemaining() < 1
  }
  // 把整颗树的变更提交( commit )到实际的DOM上
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  // requestIdleCallback: 浏览器判断高优先级的执行顺序
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

/**
 * 执行具体任务单元，并返回下一个任务单元
 */
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function

  // TODO 创建新的 fiber (从element 到 DOM 节点的中间产物，主要用于时间切片)
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // TODO 返回下一个任务单元
  if (fiber.child) {
    return fiber.child
  }

  let newFiber = fiber
  while (newFiber) {
    if (newFiber.sibling) {
      return newFiber.sibling
    }
    newFiber = newFiber.parent
  }
}

let wipFiber = null
let hookIndex = null

/** 更新函数组件  */
function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

/** Hook */
function useState(initial) {
  // 如果存在旧 hook，将旧值拷贝一份到新的 hook，否则就将 state 初始化
  const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach((action) => {
    hook.state = action(hook.state)
  })

  const setState = (action) => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}

/** 更新非函数组件 */
function updateHostComponent(fiber) {
  // TODO 添加 DOM 节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  // TODO 调和 fiber
  reconcileChildren(fiber, fiber.props.children)
}

/* 导出 */
const Didact = {
  createElement,
  render,
  useState
}

export default Didact
