(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.pray = {}));
}(this, function (exports) { 'use strict';

  var optc = function optc(o) {
    return Object.prototype.toString.call(o);
  };

  var _ = {
    /**
     * 
     * @param {Array} arrayLike 
     * @param {(index, node) -> void} cb 
     */
    each: function each(arrayLike, cb) {
      for (var i = 0; i < arrayLike.length; i++) {
        if (!!cb(i, arrayLike[i], arrayLike)) {
          break;
        }
      }
    },
    setAttr: function setAttr(el, propName, propValue) {
      switch (propName) {
        case 'style':
          el.style.cssText = propValue;
          break;
        case 'value':
          if (el.tagName === 'input' || el.tagName === 'textarea') {
            el.value = propValue;
            break;
          }
          el.setAttribute('value', propValue);
          break;
        case 'className':
          el.setAttribute('class', propValue);
          break;
        case 'key':
          el.setAttribute('data-pray-key', propValue);
          break;
        default:
          el.setAttribute(propName, propValue);
          break;
      }
    },
    isNumberOrString: function isNumberOrString(obj) {
      var type = optc(obj);
      return type === '[object Number]' || type === '[object String]';
    },
    isNotNull: function isNotNull(a) {
      return typeof a !== 'undefined' && a !== null;
    },
    flatArr: function flatArr(arr) {
      var _this = this;

      return arr.reduce(function (prev, next) {
        return prev.concat(Array.isArray(next) ? _this.flatArr(next) : next);
      }, []);
    }
  };

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
   * @class VNode
   */
  var VNode = function () {
    function VNode(type, props, children) {
      var _this = this;

      _classCallCheck(this, VNode);

      this.type = type;
      this.props = props === null ? {} : props;
      this.children = children || [];

      this.count = 0;

      this.key = this.props.key; // 用于diff

      _.each(this.children, function (index, item) {
        if (item instanceof VNode) {
          _this.count += item.count;
        } else {
          _this.children[index] = '' + item;
        }
        _this.count += 1;
      });
    }

    _createClass(VNode, [{
      key: 'render',
      value: function render() {
        var el = document.createElement(this.type);
        var props = this.props;

        for (var propName in props) {
          var propValue = props[propName];
          _.setAttr(el, propName, propValue);
        }

        for (var i = 0; i < this.children.length; i++) {
          var child = this.children[i];
          if (child instanceof VNode) {
            el.appendChild(child.render());
          } else {
            el.appendChild(document.createTextNode(child));
          }
        }

        return el;
      }

      /**
       * 只比较type和key是否相等
       * @param {VNode} otherNode 
       */

    }, {
      key: 'compare',
      value: function compare(otherNode) {
        return otherNode instanceof VNode ? otherNode.type === this.type && otherNode.key === this.key : false;
      }
    }]);

    return VNode;
  }();

  /**
   * @param {string} type 
   * @param {object} props 
   * @param  {array} children 
   * @return {VNode}
   */
  function vnode(type, props) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return new VNode(type, props, _.flatArr(children));
  }

  var PATCHES = {
    REPLACE: Symbol('replace'),
    TEXT: Symbol('text'),
    PROPS: Symbol('props'),
    REORDER: Symbol('reorder')
  };

  function dfs(node, patches, walker) {
    var currentPatches = patches[walker.index];

    var len = node.childNodes ? node.childNodes.length : 0;

    for (var i = 0; i < len; i++) {
      var child = node.childNodes[i];
      walker.index += 1;
      dfs(child, patches, walker);
    }

    if (currentPatches) {
      applyPatches(node, currentPatches);
    }
  }

  function applyPatches(node, currentPatches) {
    _.each(currentPatches, function (_$$1, patch) {
      switch (patch.type) {
        case PATCHES.REORDER:
          reorder(node, patch.moves);
          break;
        case PATCHES.REPLACE:
          var newNode = typeof patch.item === 'string' ? document.createTextNode(patch.item) : patch.item.render();
          node.parentNode.replaceChild(newNode, node);
          break;
        case PATCHES.TEXT:
          if (node.textContent) {
            // 性能更好
            node.textContent = patch.item;
          } else {
            node.nodeValue = patch.item;
          }
          break;
        case PATCHES.PROPS:
          setProps(node, patch.item);
          break;
      }
    });
  }

  function setProps(node, props) {
    for (var key in props) {
      if (typeof props[key] === 'undefined') {
        node.removeAttribute(key);
      } else {
        _.setAttr(node, key, props[key]);
      }
    }
  }

  function reorder(node, moves) {
    _.each(moves, function (i, move) {
      var index = move.index;

      switch (move.type) {
        case 0:
          // remove
          node.removeChild(node.childNodes[index]);
          break;
        case 1:
          // insert
          var insertNode = typeof move.item === 'string' ? document.createTextNode(move.item) : move.item.render();
          node.insertBefore(insertNode, node.childNodes[index] || null);
          break;
        case 2:
          // swap
          var from = move.from,
              to = move.to;

          var children = node.childNodes;
          node.insertBefore(children[from], children[to]);
          node.insertBefore(children[to], children[from]);
          break;
      }
    });
  }

  function patch(node, patches) {
    var walker = { index: 0 };
    dfs(node, patches, walker);
  }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * 传入一个item(object)和key, 获取 item 内 key 对应的 value
   * @param {Object} item 
   * @param {String|Function} key 
   * @return {any} value
   */
  function getValueByKey(item, key) {
    if (!_.isNotNull(item) || !_.isNotNull(key)) {
      return undefined;
    }
    return typeof key === 'string' ? item[key] : key(item);
  }

  /**
   * 传入 ([{id: 4},{id: 2},{id: 1},{id: 3}, {item: 5}], 'id')
   * 返回 {keyIndex: {4: 0, 1: 2, 2: 1, 3: 3}, noKeyItem: [{item: 5}]}
   * keyIndex 指的是 key 与其对应的 Index 的 object
   * noKeyItem 指的是 list 中没有 key 的项
   * @param {Array} list 
   * @param {String|Function} key 
   * @return {Object}
   *            - keyIndex: Object
   *            - noKeyItem: Array
   */
  function getKeyIndexAndNoKeyItem(list) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';

    var keyIndex = {};
    var noKeyItem = [];

    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var itemKey = getValueByKey(item, key);

      if (_.isNotNull(itemKey)) {
        keyIndex[itemKey] = i;
      } else {
        noKeyItem.push(item);
      }
    }

    return _defineProperty({
      keyIndex: keyIndex,
      noKeyItem: noKeyItem }, 'noKeyItem', noKeyItem);
  }

  function listDiff(oldArray, newArray) {
    var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

    var newMap = getKeyIndexAndNoKeyItem(newArray, key);

    var newKeyIndex = newMap.keyIndex;
    var newNoKeyItem = newMap.noKeyItem;
    var moves = [];
    var children = [];

    var noKeyIndex = 0;
    var i = 0;

    // 生成一个和oldArray等长的比较数组，
    // 其中新数组中不存在的项删除、新数组中没有key的项插入
    for (i = 0; i < oldArray.length; i++) {
      var oldItem = oldArray[i];
      var oldItemKey = getValueByKey(oldItem, key);

      if (_.isNotNull(oldItemKey)) {
        if (newKeyIndex.hasOwnProperty(oldItemKey)) {
          var newItemIndex = newKeyIndex[oldItemKey];
          children.push(newArray[newItemIndex]);
        } else {
          children.push(null);
        }
      } else {
        children.push(newNoKeyItem[noKeyIndex++] || null);
      }
    }

    var simulate = children.slice(0);
    i = 0;

    // 删除不存在的项
    while (i < simulate.length) {
      if (simulate[i] === null) {
        remove(i);
        removeSimulate(i);
      } else {
        i += 1;
      }
    }

    var j = i = 0; // j指向新数组, i指向老数组
    var offset = 0; // 偏移量, insert之后有用

    var simulateKeyIndex = getKeyIndexAndNoKeyItem(simulate, key).keyIndex;

    while (j < newArray.length) {
      var newItem = newArray[j];
      var newItemKey = getValueByKey(newItem, key);
      var _oldItem = simulate[i];
      var _oldItemKey = getValueByKey(_oldItem, key);

      if (_.isNotNull(_oldItem)) {
        if (_oldItemKey === newItemKey) {
          i += 1;
        } else {
          if (simulateKeyIndex.hasOwnProperty(newItemKey)) {
            var oldTargetIndex = simulateKeyIndex[newItemKey];
            swap(i + offset, oldTargetIndex + offset);
            swapSimulate(i, oldTargetIndex, _oldItemKey, newItemKey);
            i += 1;
          } else {
            insert(j, newItem);
            offset += 1;
          }
        }
      } else {
        insert(j, newItem);
        offset += 1;
      }
      j += 1;
    }

    var restNum = simulate.length - i;
    for (var k = 0; k < restNum; k++) {
      remove(j);
      removeSimulate(j);
    }

    function removeSimulate(index) {
      simulate.splice(index, 1);
    }

    function remove(index) {
      moves.push({ type: 0, index: index });
    }

    function insert(index, item) {
      moves.push({ type: 1, index: index, item: item });
    }

    function swapSimulate(from, to, oldItemKey, newItemKey) {
      var _ref2 = [simulate[to], simulate[from]]; // 不止要交换项，还要交换keyIndex内的值

      simulate[from] = _ref2[0];
      simulate[to] = _ref2[1];
      var _ref3 = [simulateKeyIndex[newItemKey], simulateKeyIndex[oldItemKey]];
      simulateKeyIndex[oldItemKey] = _ref3[0];
      simulateKeyIndex[newItemKey] = _ref3[1];
    }

    function swap(from, to) {
      moves.push({ type: 2, from: from, to: to });
    }

    return {
      moves: moves,
      children: children
    };
  }

  /**
   * @param {VNode} oldTree 
   * @param {VNode} newTree 
   */
  function diff (oldTree, newTree) {
    var patches = {};
    var index = 0;
    dfsWalk(oldTree, newTree, index, patches);

    return patches;
  }

  /**
   * 
   * @param {VNode} oldNode 
   * @param {VNode} newTree 
   * @param {number} index 
   * @param {array} patches 
   */
  function dfsWalk(oldNode, newNode, index, patches) {
    var currentNodePatches = [];

    if (newNode === null) ; else if (_.isNumberOrString(oldNode) && _.isNumberOrString(newNode)) {
      // 如果都是简单类型
      if (oldNode != newNode) {
        // 那就进行简单的判断
        currentNodePatches.push({
          type: PATCHES.TEXT,
          item: newNode
        });
      }
    } else if (oldNode instanceof VNode && newNode instanceof VNode) {
      // 如果都是虚拟DOM
      if (!oldNode.compare(newNode)) {
        // 浅比较不同
        currentNodePatches.push({
          type: PATCHES.REPLACE,
          index: index,
          item: newNode
        });
      } else {
        // tag相同, 对比 props 和 children
        diffAttrs(oldNode.props, newNode.props, currentNodePatches); // 对比props
        diffChildren(oldNode.children, newNode.children, index, currentNodePatches, patches); // 对比children
      }
    } else {
      // 这么复杂？直接替换
      currentNodePatches.push({
        type: PATCHES.REPLACE,
        item: newNode
      });
    }

    if (currentNodePatches.length > 0) {
      patches[index] = currentNodePatches;
    }
  }

  /**
   * @param {object} oldProps 
   * @param {object} newProps 
   * @param {array} currentNodePatches 
   */
  function diffAttrs(oldProps, newProps, currentNodePatches) {
    var diffResult = {};
    var count = 0;

    // 查找修改、删除
    for (var key in oldProps) {
      if (oldProps[key] !== newProps[key]) {
        diffResult[key] = newProps[key];
        count += 1;
      }
    }

    // 查找新增
    for (var _key in newProps) {
      if (!oldProps.hasOwnProperty(_key)) {
        diffResult[_key] = newProps[_key];
        count += 1;
      }
    }

    if (count > 0) {
      currentNodePatches.push({
        type: PATCHES.PROPS,
        item: diffResult
      });
    }
  }

  /**
   * @param {[VNode]} oldChildren 
   * @param {[VNode]} newChildren 
   * @param {array} currentNodePatches 
   * @param {array} patches 
   */
  function diffChildren(oldChildren, newChildren, index, currentNodePatches, patches) {
    var _listDiff = listDiff(oldChildren, newChildren, 'key'),
        moves = _listDiff.moves,
        children = _listDiff.children;

    if (moves.length !== 0) {
      currentNodePatches.push({
        type: PATCHES.REORDER,
        moves: moves
      });
    }

    var leftNode = null;
    var currentNodeIndex = index;

    newChildren = children;

    _.each(oldChildren, function (index, child) {
      var newChild = newChildren[index];

      currentNodeIndex = leftNode && leftNode.count ? leftNode.count + currentNodeIndex + 1 : currentNodeIndex + 1;

      leftNode = child;

      dfsWalk(child, newChild, currentNodeIndex, patches);
    });
  }

  exports.diff = diff;
  exports.patch = patch;
  exports.vnode = vnode;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
