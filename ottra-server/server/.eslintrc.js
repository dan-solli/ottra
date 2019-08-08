module.exports = {
    "env": {
        "browser": false,
        "commonjs": true,
        "es6": true
    },
    "plugins": [
        "security",
    ],
    "extends": [
        "eslint:recommended",
        "plugin:node/recommended",
        "plugin:promise/recommended",
        "plugin:security/recommended",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "node/exports-style": ["error", "module.exports"],
        "node/file-extension-in-import": ["error", "always"],
        "node/prefer-global/buffer": ["error", "always"],
        "node/prefer-global/console": ["error", "always"],
        "node/prefer-global/process": ["error", "always"],
        "node/prefer-global/url-search-params": ["error", "always"],
        "node/prefer-global/url": ["error", "always"],
        "node/prefer-promises/dns": "error",
        "node/prefer-promises/fs": "error",
        "max-lines": [ "warn", 200 ],
        "max-lines-per-function": [ "warn", 20 ],
        "complexity": [ "warn", 5 ],
        "max-nested-callbacks": [ "warn", 2 ],
        "max-depth": [ "warn", 3 ],
        "no-param-reassign": "warn",
        "max-params": [ "warn", 2 ],
  }
};