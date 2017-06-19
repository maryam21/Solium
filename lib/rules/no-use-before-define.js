/**
 * @fileoverview Ensure no variable or function is used or called before its definition.
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		var sourceCodeObject = context.getSourceCode ();

		/**
		 * Catch all declarations/definitions
		 */
		context.on ('DeclarativeExpression', function (emitted) {

			if (emitted.exit) {}

		});

		context.on ('VariableDeclarator', function (emitted) {

			if (emitted.exit) {}

		});

		context.on ('StateVariableDeclaration', function (emitted) {

		});

		context.on ('EnumDeclaration', function (emitted) {

		});

		context.on ('FunctionDeclaration', function (emitted) {

		});

		context.on ('StructDeclaration', function (emitted) {

		});

		context.on ('ContractStatement', function (emitted) {

		});

		context.on ('LibraryStatement', function (emitted) {

		});

		/**
		 * Catch all usages
		 */
		context.on ('Identifier', function (emitted) {

			if (emitted.exit) {}

		});

	}

};
