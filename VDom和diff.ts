class myElement {
  tag: string;
  props: object;
  childer: any[] | string;
  key: string;

  constructor(tag, props, childer, key) {
    this.tag = tag;
    this.props = props;
    if (Array.isArray(childer)) {
      this.childer = childer;
    } else if (typeof childer === "string") {
      this.key = childer;
      this.childer = null;
    }
    if (key) this.key = key;
  }

  // 渲染
  render() {
    let root = this._createElement(
      this.tag,
      this.props,
      this.childer,
      this.key
    );
    document.body.appendChild(root);
    return root;
  }
  create() {
    return this._createElement(this.tag, this.props, this.childer, this.key);
  }
  // 创建节点
  _createElement(tag, props, child, key): Node {
    // 通过tag创建节点
    let el = document.createElement(tag);
    // 设置节点属性
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        const value = props[key];
        el.setAttribute(key, value);
      }
    }
    if (key) {
      el.setAttribute("key", key);
    }
    // 递归添加子节点
    if (child) {
      child.forEach((element) => {
        let child;
        if (element instanceof Element) {
          child = this._createElement(
            element.tag,
            element.props,
            element.children,
            element.key
          );
        } else {
          child = document.createTextNode(element);
        }
        el.appendChild(child);
      });
    }
    return el;
  }
}

function diff(oldDomTree, newDomTree) {
  let pathchs = {};
  dfs(oldDomTree, newDomTree, 0, pathchs);
  return pathchs;
}

function dfs(oldNode, newNode, index, pathchs) {
  // 用于保存子树的更改
  let curPatches = [];
  // 需要判断三种情况
  // 1.没有新的节点，那么什么都不⽤做
  // 2.新的节点的 tagName 和 `key` 和旧的不同，就替换
  // 3.新的节点的 tagName 和 key（可能都没有） 和旧的相同，开始遍历⼦树
  if (!newNode) {
  } else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
    // 判断属性是否变更
    let props = diffProps(oldNode.props, newNode.props);
    if (props.length) curPatches.push({ type: StateEnums.ChangeProps, props });
    // 遍历⼦树
    diffChildren(oldNode.children, newNode.children, index, pathchs);
  } else {
    // 节点不同，需要替换
    curPatches.push({ type: StateEnums.Replace, node: newNode });
  }

  if (curPatches.length) {
    if (pathchs[index]) {
      pathchs[index] = pathchs[index].concat(curPatches);
    }
  } else {
    pathchs[index] = curPatches;
  }
}

// 判断属性的更改
function diffProps(oldProps, newProps) {
  // 判断 Props 分以下三步骤
  // 先遍历 oldProps 查看是否存在删除的属性
  // 然后遍历 newProps 查看是否有属性值被修改
  // 最后查看是否有属性新增
  let change = [];
  for (const key in oldProps) {
    if (oldProps.hasOwnProperty(key) && !newProps[key]) {
      change.push({
        prop: key,
      });
    }
  }

  for (const key in newProps) {
    if (newProps.hasOwnProperty(key)) {
      const prop = newProps[key];
      if (oldProps[key] && oldProps[key] !== newProps[key]) {
        change.push({
          prop: key,
          value: newProps[key],
        });
      } else if (!oldProps[key]) {
        change.push({
          prop: key,
          value: newProps,
        });
      }
    }
  }
  return change;
}
// 判断列表差异
function listDiff(oldList, newList, index, patches) {
  // 为了遍历⽅便，先取出两个 list 的所有 keys
  let oldKeys = getKeys(oldList);
  let newKeys = getKeys(newList);
  let changes = [];
  // ⽤于保存变更后的节点数据
  // 使⽤该数组保存有以下好处
  // 1.可以正确获得被删除节点索引
  // 2.交换节点位置只需要操作⼀遍 DOM
  // 3.⽤于 `diffChildren` 函数中的判断，只需要遍历
  // 两个树中都存在的节点，⽽对于新增或者删除的节点来说，完全没必要
  // 再去判断⼀遍
  let list = [];
  oldList &&
    oldList.forEach((item) => {
      let key = item.key;
      if (typeof item === "string") {
        key = item;
      }
      // 寻找新的 children 中是否含有当前节点
      // 没有的话需要删除
      let index = newKeys.indexOf(key);
      if (index === -1) {
        list.push(null);
      } else list.push(key);
    });
  // 遍历变更后的数组
  let length = list.length;
  // 因为删除数组元素是会更改索引的
  // 所有从后往前删可以保证索引不变
  for (let i = length - 1; i >= 0; i--) {
    // 判断当前元素是否为空，为空表示需要删除
    if (!list[i]) {
      list.splice(i, 1);
      changes.push({
        type: StateEnums.Remove,
        index: i,
      });
    }
  }
  // 遍历新的 list，判断是否有节点新增或移动
  // 同时也对 `list` 做节点新增和移动节点的操作
  newList &&
    newList.forEach((item, i) => {
      let key = item.key;
      if (typeof item === "string") {
        key = item;
      }
      // 寻找旧的 children 中是否含有当前节点
      let index = list.indexOf(key);
      // 没找到代表新节点，需要插⼊
      if (index === -1 || key == null) {
        changes.push({
          type: StateEnums.Insert,
          node: item,
          index: i,
        });
        list.splice(i, 0, key);
      } else {
        // 找到了，需要判断是否需要移动
        if (index !== i) {
          changes.push({
            type: StateEnums.Move,
            from: index,
            to: i,
          });
          move(list, index, i);
        }
      }
    });
  return { changes, list };
}

function getKeys(list) {
  let keys = [];
  let text;
  list &&
    list.forEach((item) => {
      let key;
      if (typeof item === "string") {
        key = [item];
      } else if (item instanceof Element) {
        key = item.key;
      }
      keys.push(key);
    });
  return keys;
}

// 遍历⼦元素打标识
function diffChildren(oldChild, newChild, index, patches) {
  let { changes, list } = listDiff(oldChild, newChild, index, patches);
  if (changes.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(changes);
    } else {
      patches[index] = changes;
    }
  }
  // 记录上⼀个遍历过的节点
  let last = null;
  oldChild &&
    oldChild.forEach((item, i) => {
      let child = item && item.children;
      if (child) {
        index =
          last && last.children ? index + last.children.length + 1 : index;
        let keyIndex = list.indexOf(item.key);
        let node = newChild[keyIndex];
        // 只遍历新旧中都存在的节点，其他新增或者删除的没必要遍历
        if (node) {
          dfs(item, node, index, patches);
        }
      } else index += 1;
      last = item;
    });
}

// 渲染差异
let index = 0;
function patch(node, patchs) {
  let changes = patchs[index];
  let childNodes = node && node.childNodes;
  // 这⾥的深度遍历和 diff 中是⼀样的
  if (!childNodes) index += 1;
  if (changes && changes.length && patchs[index]) {
    changeDom(node, changes);
  }
  let last = null;
  if (childNodes && childNodes.length) {
    childNodes.forEach((item, i) => {
      index =
        last && last.children
          ? index + last.children.length + 1
          : index + patch(item, patchs);
      last = item;
    });
  }
}

function changeDom(node, changes) {
  changes &&
    changes.forEach((change) => {
      let { type } = change;
      switch (type) {
        case StateEnums.ChangeProps:
          let { props } = change;
          props.forEach((item) => {
            if (item.value) {
              node.setAttribute(item.prop, item.value);
            } else {
              node.removeAttribute(item.prop);
            }
          });
          break;
        case StateEnums.Remove:
          node.childNodes[change.index].remove();
          break;
        case StateEnums.Insert:
          let dom;
          if (typeof change.node === "string") {
            dom = document.createTextNode(change.node);
          } else if (change.node instanceof Element) {
            dom = change.node.create();
          }
          node.insertBefore(dom, node.childNodes[change.index]);
          break;
        case StateEnums.Replace:
          node.parentNode.replaceChild(change.node.create(), node);
          break;
        case StateEnums.Move:
          let fromNode = node.childNodes[change.from];
          let toNode = node.childNodes[change.to];
          let cloneFromNode = fromNode.cloneNode(true);
          let cloenToNode = toNode.cloneNode(true);
          node.replaceChild(cloneFromNode, toNode);
          node.replaceChild(cloenToNode, fromNode);
          break;
        default:
          break;
      }
    });
}

function move(list, index, i) {}

enum StateEnums {
  ChangeProps = "changeProps",
  Remove = "remove",
  Insert = "insert",
  Replace = "replace",
  Move = "move",
}
