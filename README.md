# SOCKO! - Hierarchical Tree Weaver

[![TestingBot Test Status](https://testingbot.com/buildstatus/d87072aa349553678b4951d26e743159)](https://testingbot.com/builds/d87072aa349553678b4951d26e743159)
 [![Build Status](https://travis-ci.org/dodevops/socko-api.svg?branch=master)](https://travis-ci.org/dodevops/socko-api) [![Coverage Status](https://coveralls.io/repos/github/dodevops/socko-api/badge.svg?branch=master)](https://coveralls.io/github/dodevops/socko-api?branch=master) [![npm](https://img.shields.io/npm/v/socko-api.svg)](https://www.npmjs.com/package/socko-api)

[![Browser Matrix](https://testingbot.com/buildmatrix/d87072aa349553678b4951d26e743159)](https://testingbot.com/builds/d87072aa349553678b4951d26e743159)

## Introduction

SOCKO! is an ETL tool for trees. It walks through an *input tree*, applies various modifications from a *hierarchy tree* to it and returns the *resulting tree*.

This is the core SOCKO api. It's currently the base framework for the SOCKO! command line tool and Grunt helper, that use the API to modify a set of directories in the area of configuration file management. The API is heavily based on [js-hierarchy](https://www.npmjs.com/package/js-hierarchy).

The current features include:

* Use the contents of a node in the hierarchy-tree, that has the same name as a node in the input-tree
* Insert the content of one or multiple cartridge node in the hierarchy tree into the content of a socket node in the input tree at a specific index
* Collect a bunch of nodes from the hierarchy-tree and put them in a corresponding branch node of the result tree

For details, see the [API documentation](https://dodevops.github.io/socko-api/)

## Usage

### Typescript

The module includes the complete type definitions for Typescript
applications. Simply install the module and you're ready to go:

```typescript
import {RootNodeBuilder} from 'socko-api';

let rootNode: RootNodeInterface = new RootNodeBuilder().build();
```

### Node.js

After installing the module, use it with require():

```javascript
var sockoApi = require('socko-api');

var rootNode = new sockoApi.RootNodeBuilder().build();
```

### Browser

Install the module and include the browser script:

```html
<script type="text/javascript" src="node_modules/socko-api/browser.min.js"></script>
```

or use the jsDelivr CDN hosted version:
```html
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/socko.api/browser.min.js"></script>
```

With this the global namespace will include a "sockoapi" object:

```javascript
var rootNode = new sockoapi.RootNodeBuilder().build();
```

After that, everything's right as working in Node.js.

## Nodes and processors

The SOCKO! api provides a set of custom js-hierarchy nodes. All nodes implement the interface "SockoNodeInterface", that adds a "type" and a "content" property. The type references the specific node, that was used and is mainly used to identify the nodes at runtime. The content holds the original or generated content of the node.

These nodes are provided by the core API:

* RootNodeInterface: The root of each tree
* BranchNodeInterface: A node, that holds children
* SimpleNodeInterface, OutputNodeInterface: A node, that holds content, but no children. The SimpleNode is used in the input- and hierarchy-trees and the OutputNode in the result tree.
* SkippedNodeInterface: A node, that was skipped by the current processor

The different features of the SOCKO! api rely on processors, that process specific node types when walking the input tree. So each processor uses additional node types

* SocketProcessor:
  - SocketNodeInterface: A "skeleton" node, that holds different insertion slots for cartridge nodes or cartridge collectors to insert content at various parts of the SocketNode content
  - CartridgeNodeInterface: A node, that is inserted into one or more slots of SocketNodes
* BucketProcessor:
  - BucketNodeInterface: A node in the input node producing a branch node in the result tree collecting SimpleNodes from the hierarchy-tree
