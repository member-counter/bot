module.exports = {
	env: {
		node: true,
		es2021: true
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: "latest",
		sourceType: "module"
	},
	plugins: ["@typescript-eslint", "prettier"],
	rules: {
		"@typescript-eslint/no-unused-vars": ["error"],
		"@typescript-eslint/no-explicit-any": "off",
		"prettier/prettier": ["error"],
		quotes: [
			"error",
			"double",
			{ avoidEscape: true, allowTemplateLiterals: true }
		],
		semi: ["error", "always"],
		"prefer-const": [
			"error",
			{
				destructuring: "any",
				ignoreReadBeforeAssign: false
			}
		],
		"prefer-destructuring": [
			"error",
			{
				array: true,
				object: true
			},
			{
				enforceForRenamedProperties: false
			}
		],
		"no-useless-escape": "off",
		"no-console": ["error"],
		"no-empty": ["error", { allowEmptyCatch: true }]
	}
};
