# tree-flatter

Transforms a nested tree structure into a flat list, **each item has it's children reference and parent reference**.

![version](https://img.shields.io/npm/v/tree-flatter.svg)
![Node.js](https://img.shields.io/badge/node.js-%3E=_6.0-brightgreen.svg)
[![Dependency Status](https://david-dm.org/MrPeak/flatten-tree.svg)](https://david-dm.org/jweidler/flatten-tree)
[![devDependency Status](https://david-dm.org/MrPeak/flatten-tree/dev-status.svg)](https://david-dm.org/jweidler/flatten-tree#info=devDependencies)
[![Build Status](https://api.travis-ci.org/MrPeak/flatten-tree.svg?branch=master)](https://travis-ci.org/travis-ci/travis-web)


## Installation

```bash
$ npm install tree-flatter
```

## Usage

#### Default

```javascript
import treeFlatter from 'tree-flatter';

const tree = [
    {
        name: 'item1',
        children: [
            {
                name: 'item2',
                children: [
                    {name: 'item3'}
                ]
            },
            { name: 'item4' }
        ]
    }
];

const options = {
    initNode: node => node, // <= default, consider node => _.clone(node) to avoid mutating the tree
};

const list = treeFlatter(tree, 'children', options);ÏÏÏÏÏ
```

Results in:

```javascript
[
    {id: 1, name: 'item1', children: [2, 4]},
    {id: 2, name: 'item2', children: [3], parent: 1},
    {id: 3, name: 'item3', parent: 2},
    {id: 4, name: 'item4', parent: 1}
]
```

#### Specifies item idKey and children itemKey

```javascript
import treeFlatter from 'tree-flatter';

const tree = [
    {
        name: 'item1',
        objectID: 'aaaaaaaaaaaaaaa',
        layers: [
            {
                name: 'item2',
                objectID: 'aaaaaaaaaaaaaaa2',
                layers: [
                    {
                      name: 'item3',
                      objectID: 'aaaaaaaaaaaaaaa3',
                    }
                ]
            },
            {
              name: 'item4',
              objectID: 'aaaaaaaaaaaaaaa4',
            }
        ]
    }
];

const list = treeFlatter(tree, , {
    idKey: 'objectID',
    itemsKey: 'layers',
);
```

Results in:

```javascript
[
      { objectID: 'aaaaaaaaaaaaaaa', name: 'item1', layers: ['aaaaaaaaaaaaaaa2', 'aaaaaaaaaaaaaaa4'] },
      { objectID: 'aaaaaaaaaaaaaaa2', name: 'item2', layers: ['aaaaaaaaaaaaaaa3'], parent: 'aaaaaaaaaaaaaaa' },
      { objectID: 'aaaaaaaaaaaaaaa4', name: 'item4', parent: 'aaaaaaaaaaaaaaa' },
      { objectID: 'aaaaaaaaaaaaaaa3', name: 'item3', parent: 'aaaaaaaaaaaaaaa2' },
]
```

## API

```javascript
/**
 * Flatten tree-object
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
```

## Unit test

```bash
$ npm t
```

## License

MIT
