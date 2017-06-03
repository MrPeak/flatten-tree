'use strict';

const chai = require('chai');
const expect = chai.expect;

const flattenTree = require('./../index');

describe('Flatten tree', function() {
  let result;
  const treeGen = function(isObject) {
    const obj = {
      name: 'item1',
      children: [
        {
          name: 'item2',
          children: [{ name: 'item3' }],
        },
        { name: 'item4' },
      ],
    };

    if (isObject) {
      return obj;
    }

    return [obj];
  };

  beforeEach(function() {
    result = [
      { id: 1, name: 'item1', children: [2, 3] },
      { id: 2, name: 'item2', children: [4], parent: 1 },
      { id: 3, name: 'item4', parent: 1 },
      { id: 4, name: 'item3', parent: 2 },
    ];
  });

  it('should match list', function() {
    const list = flattenTree(treeGen(), {});
    const list2 = flattenTree(treeGen(true), {});
    expect(list).to.deep.equal(result);
    expect(list2).to.deep.equal(result);
  });

  it('should not mutate input tree when passed optional initNode() cloning nodes', function() {
    const tree = treeGen();
    const treeClone = JSON.parse(JSON.stringify(tree));

    flattenTree(tree, {
      initNode: function(node) {
        return JSON.parse(JSON.stringify(node));
      },
    });

    expect(treeClone).to.deep.equal(tree);
  });

  it('should handle deeply nested tree properly', function() {
    this.timeout(100000);

    const treeNode = {
      name: 'item',
      children: [],
    };

    result = [];

    function generateChildren(node) {
      node.children.push(JSON.parse(JSON.stringify(node)));
      return node.children[0];
    }

    let node = treeNode;
    let i;

    for (i = 0; i < 10000; i++) {
      node = generateChildren(node);

      if (i === 0) {
        result.push({
          id: i + 1,
          name: 'item',
          children: [i + 2],
        });
      } else {
        result.push({
          id: i + 1,
          name: 'item',
          children: [i + 2],
          parent: i,
        });
      }
    }

    result.push({
      id: i + 1,
      name: 'item',
      children: [],
      parent: i,
    });

    const list = flattenTree([treeNode], {});
    expect(result).to.deep.equal(list);
  });
});

describe('Flatten tree by specifying id, children key and `initNode` function', function() {
  it('should match list', function() {
    const tree = [{
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
            },
          ],
        },
        {
          name: 'item4',
          objectID: 'aaaaaaaaaaaaaaa4',
        },
      ],
    }];

    const list = flattenTree(tree, {
      idKey: 'objectID',
      itemsKey: 'layers',
      initNode: node => {
        node.objectID = node.objectID.replace('aaaaaaaaaaaaaaa', 'mrpeak');
        return node;
      },
    });

    expect(list).to.deep.equal([
      { objectID: 'mrpeak', name: 'item1', layers: ['mrpeak2', 'mrpeak4'] },
      { objectID: 'mrpeak2', name: 'item2', layers: ['mrpeak3'], parent: 'mrpeak' },
      { objectID: 'mrpeak4', name: 'item4', parent: 'mrpeak' },
      { objectID: 'mrpeak3', name: 'item3', parent: 'mrpeak2' },
    ]);
  });
});
