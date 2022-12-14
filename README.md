# pathsfilter

![CI/CD](https://github.com/majo418/pathsfilter/workflows/Publish/badge.svg)
![MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![typescript](https://img.shields.io/badge/dynamic/json?style=plastic&color=blue&label=Typescript&prefix=v&query=devDependencies.typescript&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmajo418%2Fpathsfilter%2Fmain%2Fpackage.json)
![npm](https://img.shields.io/npm/v/pathsfilter.svg?style=plastic&logo=npm&color=red)
![github](https://img.shields.io/badge/dynamic/json?style=plastic&color=darkviolet&label=GitHub&prefix=v&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmajo418%2Fpathsfilter%2Fmain%2Fpackage.json)

![](https://img.shields.io/badge/dynamic/json?color=green&label=watchers&query=watchers&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fmajo418%2Fpathsfilter)
![](https://img.shields.io/badge/dynamic/json?color=yellow&label=stars&query=stargazers_count&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fmajo418%2Fpathsfilter)
![](https://img.shields.io/badge/dynamic/json?color=orange&label=subscribers&query=subscribers_count&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fmajo418%2Fpathsfilter)
![](https://img.shields.io/badge/dynamic/json?color=navy&label=forks&query=forks&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fmajo418%2Fpathsfilter)
![](https://img.shields.io/badge/dynamic/json?color=darkred&label=open%20issues&query=open_issues&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fmajo418%2Fpathsfilter)

# table of contents 
- [pathsfilter](#pathsfilter)
- [table of contents](#table-of-contents)
- [About](#about)
- [Example](#example)
- [npm scripts](#npm-scripts)
  - [use](#use)
  - [base scripts](#base-scripts)
  - [watch mode](#watch-mode)
- [contribution](#contribution)

# About
A library for nodejs to filter paths like a .gitignore, .dockerignore or .npmignore file.

# Example
```ts
import {
    matchPathSelector,
    parsePathSelector,
} from "pathsfilter"

const pathSelectorScript = parsePathSelector(`
    *
    !test/*
    test/logs/*
    !**/keep
    **/nkeep
`)
const toFilter = [
    "qwe",
    "znhghngh.test",
    "keep",
    "nkeep",
    "test.asdd",
    "test/asdasd",
    "test/znhghngh.test",
    "test/test.asdd",
    "test/keep",
    "test/nkeep",
    "test/logs/asdasd",
    "test/logs/znhghngh.test",
    "test/logs/test.asdd",
    "test/logs/keep",
    "test/logs/nkeep",
]
const result = toFilter.filter(
    (v) => !matchPathSelector(v, pathSelectorScript)
)
/* this is the result:
result = [
  "keep",
  "test/asdasd",
  "test/znhghngh.test",
  "test/test.asdd",
  "test/keep",
  "test/logs/keep",
]
*/
```

# npm scripts
The npm scripts are made for linux but can also work on mac and windows.
## use
You can run npm scripts in the project folder like this:
```sh
npm run <scriptname>
```
Here is an example:
```sh
npm run test
```

## base scripts
You can find all npm scripts in the `package.json` file.
This is a list of the most important npm scripts:
 - test // test the app
 - build // build the app
 - exec // run the app
 - start // build and run the app

## watch mode
Like this example you can run all npm scripts in watch mode:
```sh
npm run start:watch
```

# contribution
 - 1. fork the project
 - 2. implement your idea
 - 3. create a pull/merge request
```ts
// please create seperated forks for different kind of featues/ideas/structure changes/implementations
```

---
**cya ;3**  
*by majo418*