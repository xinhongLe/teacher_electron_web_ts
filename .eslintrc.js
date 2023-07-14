module.exports = {
    root: true,
    env: {
        node: true
    },
    globals: {
        electron: true,
        MathJax: true,
        defineProps: true,
        defineEmits: true,
        defineExpose: true
    },
    extends: [
        "plugin:vue/vue3-essential",
        "@vue/standard",
        "@vue/typescript/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        indent: ["error", 4, { SwitchCase: 1 }],
        semi: ["error", "always"],
        quotes: [2, "double"],
        "space-before-function-paren": 0,
        "dot-notation": [0, { allowKeywords: false, allowPattern: "" }],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-var-requires": "off",
        "no-unmodified-loop-condition": "off",
        "no-tabs": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-unused-expressions": "off",
        "camelcase": "off"
    }
};
