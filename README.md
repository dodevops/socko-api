# SOCKO! - Hierarchical Tree Weaver

## Introduction

SOCKO! is an ETL tool for trees. It walks through an *input tree*, applies various modifications from a *hierarchy tree* to it and returns the *resulting tree*.

This is the core SOCKO api. It's currently the base framework for the SOCKO! command line tool and Grunt helper, that use the API to modify a set of directories in the area of configuration file management. The API is heavily based on [js-hierarchy](https://www.npmjs.com/package/js-hierarchy).

The current features include:

* Use the contents of a node in the hierarchy-tree, that has the same name as a node in the input-tree
* Insert the content of one or multiple cartridge node in the hierarchy tree into the content of a socket node in the input tree at a specific index
* Collect a bunch of nodes from the hierarchy-tree and put them in a corresponding branch node of the resulting tree

## Nodes and processors

The SOCKO! api provides a set of custom js-hierarchy nodes. All nodes implement the interface "SockoNodeInterface", that adds a "type" and a "content" property. The type references the specific node, that was used and is mainly used to identify the nodes at runtime. The content holds the original or generated content of the node.

These nodes are provided by the core API:

* RootNodeInterface: The root of each tree
* BranchNodeInterface: A node, that holds children
* SimpleNodeInterface, OutputNodeInterface: A node, that holds content, but no children. The SimpleNode is used in the input- and hierarchy-trees and the OutputNode in the resulting tree.
* SkippedNodeInterface: A node, that was skipped by the current processor

The different features of the SOCKO! api rely on processors, that process specific node types when walking the input tree. So each processor uses additional node types

* SocketProcessor:
  - SocketNodeInterface: A "skeleton" node, that holds different insertion slots for cartridge nodes or cartridge collectors to insert content at various parts of the SocketNode content
  - CartridgeNodeInterface: A node, that is inserted into one or more slots of SocketNodes
* BucketProcessor:
  - BucketNodeInterface: A node in the input node producing a branch node in the resulting tree collecting SimpleNodes from the hierarchy-tree

## Contributing

You'd like to contribute to the project? GREAT! Thank you very much.

We're always open for contributions. If you find a bug or need a feature, please simply report it using the GitHub issue tracker. Please be as precise as possible.

If you'd like to provide a pull request for something, we kindly ask you to follow these guidelines:

* If no matching issue exist, please create one
* Fork the repository
* Create a branch in your fork. You might call this branch issue-<issue number> for example.
* Write a test or extend the current testsuites, that will trigger your found bug or use your new feature. Run the test. It will turn red.
* Write the new feature or fix the bug and tweak it until your test is green
* Don't use comments describing your code. Use the included logging framework to log debug messages on these lines instead
* Document new methods or classed. Use the rest of the codebase for reference
* Run "grunt release" once your ready
* Fix all tslint issues
* Have a look at the generated documentation and check, if it's valid
* Commit the code referencing the previously created issue ("closes #123"). Be verbose about your changes.
* Push the code and create a pull request
* We'll review the pull request, maybe ask you for details and finally accept the pull request
