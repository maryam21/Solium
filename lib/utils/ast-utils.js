/**
 * @fileoverview Utility functions to help efficiently explore the Abstract Syntax Tree
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var Ajv = require ('ajv'),
	util = require ('util'), jsUtils = require ('./js-utils'),
	astNodeSchema = require ('../../config/schemas/ast-node');

var nodeSchemaValidator = new Ajv ({ allErrors: true }), sourceCodeText = '';


// For internal use. Throws if is passed an invalid AST node, else does nothing.
function throwIfInvalidNode (node, functionName) {
	if (!exports.isASTNode (node)) {
		throw new Error (functionName + '(): ' + util.inspect (node) + ' is not a valid AST node.');
	}
}


/**
 * Initialization method - provide all the necessary information astUtils functions could require in order to work
 * @param {String} sourceCodeText The source code being linted
 */
exports.init = function (sourceCode) {
	sourceCodeText = sourceCode;
};

/**
 * Check if given argument is an AST Node
 * @param {Object} possibleObject Argument to check for validity
 * @returns {Boolean} isAValidASTNode true if given argument is an AST node, false otherwise
 */
exports.isASTNode = nodeSchemaValidator.compile (astNodeSchema);

/**
 * Get the parent node of the specified node
 * @param {Object} node The AST Node to retrieve the parent of
 * @returns {Object} nodeParent Parent node of the given node
 */
exports.getParent = function (node) {
	throwIfInvalidNode (node, 'getParent');
	return node.parent;
};

/**
 * Find an ancestor node of the given node by specifying criteria
 * @param {Object} node The AST Node to retrieve the ancestor of
 * @param {Object} criteria Search criteria
 */
exports.findParent = function (node, criteria) {
	throwIfInvalidNode (node, 'findParent');

	if (!jsUtils.isStrictlyObject (criteria)) {
		throw new Error (util.inspect (criteria) + ' is not an object');
	}

	if (typeof criteria.type !== 'string') {
		throw new Error ('Only AST Node "type" property is supported for search criteria.');
	}

	var currNode = node.parent;

	// Will never go into an infinite loop
	// Termination condition is encountered when either node.parent doesn't exist (undefined), is null,
	// is an invalid value or a valid AST that meets the criteria. All these cases are handled to exit the loop.
	while (currNode !== null) {
		throwIfInvalidNode (currNode, 'findParent');

		if (currNode.type === criteria.type) {
			return currNode;
		}

		currNode = currNode.parent;
	}

	// All ancestors were examined but none satisfied the criteria, so we reached the top,
	// ie, parent of the 'Program' Node (which is null).
	return null;
};

/**
 * Convenience Alias for findParent(node, {type: specifiedType})
 * @param {Object} node The AST Node to retrieve the ancestor of
 * @param {String} type AST Node Type to specify in criteria
 */
exports.findParentByType = function (node, type) {
	return this.findParent (node, {type: type});
};

/**
 * Retrieve the line number on which the code for provided node STARTS
 * @param {Object} node The AST Node to retrieve the line number of
 * @returns {Integer} lineNumber Line number of code of the specified node. (LINES BEGIN FROM 1)
 */
exports.getLine = function (node) {
	throwIfInvalidNode (node, 'getLine');

	var newLineCharsBefore = sourceCodeText
		.slice (0, node.start)
		.match (/\n/g);

	return (
		(newLineCharsBefore ? newLineCharsBefore.length : 0) + 1
	);
};

/**
 * Retrieve the column number of the first character of the given node
 * @param {Object} node The AST Node to retrieve the column number of
 * @returns {Integer} columnNumber Column number of code of the specified node (COLUMNS BEGIN FROM 0)
 */
exports.getColumn = function (node) {
	throwIfInvalidNode (node, 'getColumn');

	//start looking from sourceCodeText [node.start] and stop upon encountering the first linebreak character
	for (var i = node.start; i >= 0; i--) {
		if (sourceCodeText [i] === '\n') {
			return node.start - i - 1;
		}
	}

	return node.start;
};

/**
 * Retrieve the line number on which the code for provided node ENDS
 * @param {Object} node The AST Node to retrieve the line number of
 * @returns {Integer} lineNumber Line number of code ending of the specified node. (LINES BEGIN FROM 1)
 */
exports.getEndingLine = function (node) {
	throwIfInvalidNode (node, 'getEndingLine');

	var newLineCharsBefore = sourceCodeText
		.slice (0, node.end)
		.trim ()
		.match (/\n/g);

	return (
		(newLineCharsBefore ? newLineCharsBefore.length : 0) + 1
	);
}

/**
 * Retrieve the column number of the last character that is part of the given node
 * @param {Object} node The AST Node to retrieve the ending column number of
 * @returns {Integer} columnNumber Column number of last char of the specified node (COLUMNS BEGIN FROM 0)
 */
exports.getEndingColumn = function (node) {
	throwIfInvalidNode (node, 'getEndingColumn');

	//start looking from 1 character before node.start and stop upon encountering the first linebreak character
	for (var i = node.end - 1; i >= 0; i--) {
		if (sourceCodeText [i] === '\n') {
			return node.end - i - 2;
		}
	}

	return node.end - 1;
};