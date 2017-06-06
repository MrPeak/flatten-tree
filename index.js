'use strict';

const _ = require('lodash');

/**
 * Recursive node
 *
 * @param {Object} node - Object node
 * @param {Object|String} parent - parent node
 * @param {Number} index - chilren index
 * @param {Object} settings - config settings
 * @param {Array} stack - data stack
 * @return {Function} Recursive function
 */
function flattenNodeGenerator(node, parent, index, settings, stack) {
  const { itemsKey, idKey } = settings;

  return function flattenNode(list) {
    node = settings.initNode(node);
    node[idKey] = node[idKey] || settings.generateUniqueId();
    list.push(node);

    if (node[itemsKey]) {
      for (let i = 0, len = node[itemsKey].length; i < len; i++) {
        stack.push(
          flattenNodeGenerator(
            node[itemsKey][i],
            node,
            i,
            settings,
            stack
          )
        );
      }
    }

    if (parent && parent[itemsKey]) {
      // Records children' id
      parent[itemsKey][index] = node[idKey];
      node.parent = parent[idKey];
    }

    return list;
  };
}

/**
 * Flatten Object tree
 *
 * @param {Array|Object} tree - Object tree
 * @param {Object} options - Config options
 * @param {Function=} [options.initNode=(node=>node)] - Initialize node
 * @param {String=} [options.itemsKey='children'] - Specifies item's children itemsKey
 * @param {String=} [options.idKey='id'] - Specifies item's idKey
 * @param {Number=} [options.uniqueIdStart=1] - Unique id start
 * @param {Function=} [options.generateUniqueId=(() => settings.uniqueIdStart++)] - Unique id generator
 *
 * @return {Object[]} Flatten collection
 */
const flatten = function(tree, options) {
  let list = [];
  const stack = [];
  console.log(tree);
  const _tree = _.cloneDeep(tree);
  const settings = {
    initNode: options.initNode || (node => node),
    itemsKey: options.itemsKey || 'children',
    idKey: options.idKey || 'id',
    uniqueIdStart: options.uniqueIdStart || 1,
    generateUniqueId: options.generateUniqueId ||
      (() => settings.uniqueIdStart++),
  };

  if (Array.isArray(_tree) && _tree.length) {
    // Object Array
    for (let i = 0, len = _tree.length; i < len; i++) {
      stack.push(
        flattenNodeGenerator(
          _tree[i],
          'root', // placeholder
          i,
          settings,
          stack
        )
      );
    }
  } else {
    // One object tree
    stack.push(flattenNodeGenerator(_tree, 'root', 0, settings, stack));
  }

  while (stack.length) {
    list = stack.shift()(list);
  }

  return list;
};

module.exports = flatten;
