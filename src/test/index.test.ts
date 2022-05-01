import "mocha"
import { expect } from "chai"

import {
    matchPathSelector,
    PathShape,
    parsePathSelector,
    PathSelector,
    matchPathShape
} from "../index"
import exp = require("constants")

describe('Test pathsfilter base functions', () => {
    it("match PathShape tests", () => {
        let tsPattern: PathShape =
            ["test", "typescript", "src", "index.ts"]
        let jsPattern: PathShape =
            ["test", "js", "source", "index.js"]
        let wildcardTsPattern: PathShape =
            ["*", "*", "*", "index.ts"]
        let wildcardJsPattern: PathShape =
            ["*", "*", "*", "index.js"]
        let anywhereWildcardTsPattern: PathShape =
            ["**", "index.ts"]

        let testPaths: [string, boolean, PathShape][]
        let testPattern: PathShape

        testPattern = tsPattern
        testPaths = [
            ["test/typescript/src/index.ts", true, testPattern],
            ["test/test/typescript/src/index.ts", false, testPattern],
            ["test/typescript/src/index.js", false, testPattern],
            ["test/js/source/index.js", false, testPattern],
            ["test/test/typescript/src/index.js", false, testPattern],
            ["test/asdasd/dsdsd/index.ts", false, testPattern],
            ["test/asdads/asdasda/index.js", false, testPattern],
            ["test/typescript/src/src/src/index.ts", false, testPattern],
            ["index.ts", false, testPattern],
            ["index.js", false, testPattern],
            ["typescript/src/src/src/index.json", false, testPattern],
            ["typescript/src/src/src/index.js", false, testPattern],
            ["typescript/index.ts", false, testPattern],
            ["typescript/index.js", false, testPattern],
            ["javascript/index.ts", false, testPattern],
            ["javascript/index.js", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.ts", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.js", false, testPattern],
        ]
        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testPathShape(
                    testPaths[index][0],
                    testPaths[index][1],
                    testPaths[index][2],
                    index,
                    testPaths[index][2].join("/"),
                ),
                "Error on values: " + testPaths[index][0] + ", " + testPaths[index][1] + ", " + testPaths[index][2] + ", " + testPaths[index][2].join("/")
            ).is.false
        }

        testPattern = jsPattern
        testPaths = [
            ["test/typescript/src/index.ts", false, testPattern],
            ["test/test/typescript/src/index.ts", false, testPattern],
            ["test/typescript/src/index.js", false, testPattern],
            ["test/js/source/index.js", true, testPattern],
            ["test/test/typescript/src/index.js", false, testPattern],
            ["test/asdasd/dsdsd/index.ts", false, testPattern],
            ["test/asdads/asdasda/index.js", false, testPattern],
            ["test/typescript/src/src/src/index.ts", false, testPattern],
            ["index.ts", false, testPattern],
            ["index.js", false, testPattern],
            ["typescript/src/src/src/index.json", false, testPattern],
            ["typescript/src/src/src/index.js", false, testPattern],
            ["typescript/index.ts", false, testPattern],
            ["typescript/index.js", false, testPattern],
            ["javascript/index.ts", false, testPattern],
            ["javascript/index.js", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.ts", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.js", false, testPattern],
        ]
        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testPathShape(
                    testPaths[index][0],
                    testPaths[index][1],
                    testPaths[index][2],
                    index,
                    testPaths[index][2].join("/"),
                ),
                "Error on values: " + testPaths[index][0] + ", " + testPaths[index][1] + ", " + testPaths[index][2] + ", " + testPaths[index][2].join("/")
            ).is.false
        }

        testPattern = wildcardTsPattern
        testPaths = [
            ["test/typescript/src/index.ts", true, testPattern],
            ["test/test/typescript/src/index.ts", false, testPattern],
            ["test/typescript/src/index.js", false, testPattern],
            ["test/js/source/index.js", false, testPattern],
            ["test/test/typescript/src/index.js", false, testPattern],
            ["test/asdasd/dsdsd/index.ts", true, testPattern],
            ["test/asdads/asdasda/index.js", false, testPattern],
            ["test/typescript/src/src/src/index.ts", false, testPattern],
            ["index.ts", false, testPattern],
            ["index.js", false, testPattern],
            ["typescript/src/src/src/index.json", false, testPattern],
            ["typescript/src/src/src/index.js", false, testPattern],
            ["typescript/index.ts", false, testPattern],
            ["typescript/index.js", false, testPattern],
            ["javascript/index.ts", false, testPattern],
            ["javascript/index.js", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.ts", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.js", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.js", false, testPattern],
            ["asdads/dsd/dsd/index.js/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
            ["asdads/dsd/dsd/indexjs/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
            ["asdads/dsd/dsd/jfghindex.js/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
            ["asdads/dsd/dsd/index.jsdfghdfgh/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
        ]
        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testPathShape(
                    testPaths[index][0],
                    testPaths[index][1],
                    testPaths[index][2],
                    index,
                    testPaths[index][2].join("/"),
                ),
                "Error on values: " + testPaths[index][0] + ", " + testPaths[index][1] + ", " + testPaths[index][2] + ", " + testPaths[index][2].join("/")
            ).is.false
        }

        testPattern = wildcardJsPattern
        testPaths = [
            ["test/typescript/src/index.ts", false, testPattern],
            ["test/test/typescript/src/index.ts", false, testPattern],
            ["test/typescript/src/index.js", true, testPattern],
            ["test/js/source/index.js", true, testPattern],
            ["test/test/typescript/src/index.js", false, testPattern],
            ["test/asdasd/dsdsd/index.ts", false, testPattern],
            ["test/asdads/asdasda/index.js", true, testPattern],
            ["test/typescript/src/src/src/index.ts", false, testPattern],
            ["index.ts", false, testPattern],
            ["index.js", false, testPattern],
            ["typescript/src/src/src/index.json", false, testPattern],
            ["typescript/src/src/src/index.js", false, testPattern],
            ["typescript/index.ts", false, testPattern],
            ["typescript/index.js", false, testPattern],
            ["javascript/index.ts", false, testPattern],
            ["javascript/index.js", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.ts", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.js", false, testPattern],
            ["asdads/dsd/dsd/index.js/dsd/dsd/dsd/da/d/f/s/", true, testPattern],
            ["asdads/dsd/dsd/indexjs/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
            ["asdads/dsd/dsd/jfghindex.js/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
            ["asdads/dsd/dsd/index.jsdfghdfgh/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
        ]
        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testPathShape(
                    testPaths[index][0],
                    testPaths[index][1],
                    testPaths[index][2],
                    index,
                    testPaths[index][2].join("/"),
                ),
                "Error on values: " + testPaths[index][0] + ", " + testPaths[index][1] + ", " + testPaths[index][2] + ", " + testPaths[index][2].join("/")
            ).is.false
        }

        testPattern = anywhereWildcardTsPattern
        testPaths = [
            ["test/typescript/src/index.ts", true, testPattern],
            ["test/test/typescript/src/index.ts", true, testPattern],
            ["test/typescript/src/index.js", false, testPattern],
            ["test/js/source/index.js", false, testPattern],
            ["test/test/typescript/src/index.js", false, testPattern],
            ["test/asdasd/dsdsd/index.ts", true, testPattern],
            ["test/asdads/asdasda/index.js", false, testPattern],
            ["test/typescript/src/src/src/index.ts", true, testPattern],
            ["index.ts", true, testPattern],
            ["index.js", false, testPattern],
            ["typescript/src/src/src/index.json", false, testPattern],
            ["typescript/src/src/src/index.js", false, testPattern],
            ["typescript/index.ts", true, testPattern],
            ["typescript/index.js", false, testPattern],
            ["javascript/index.ts", true, testPattern],
            ["javascript/index.js", false, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.ts", true, testPattern],
            ["asdads/dsd/dsd/dsd/dsd/dsd/da/d/f/s/index.js", false, testPattern],
            ["asdads/dsd/dsd/index.js/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
            ["asdads/dsd/dsd/indexjs/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
            ["asdads/dsd/dsd/jfghindex.js/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
            ["asdads/dsd/dsd/index.jsdfghdfgh/dsd/dsd/dsd/da/d/f/s/", false, testPattern],
        ]
        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testPathShape(
                    testPaths[index][0],
                    testPaths[index][1],
                    testPaths[index][2],
                    index,
                    testPaths[index][2].join("/"),
                ),
                "Error on values: " + testPaths[index][0] + ", " + testPaths[index][1] + ", " + testPaths[index][2] + ", " + testPaths[index][2].join("/")
            ).is.false
        }
    })
    it("match source PathScript Pattern tests", () => {
        const testPattern = parsePathSelector(`
        src
        !src/test
        src/test/logs
    `)
        let testPaths: [string, boolean][]
        testPaths = [
            ["src/test.json", true],
            ["src/test/test.json", false],
            ["test/test.json", false],
            ["src/test/tml.txt", false],
            ["src/test/twowowow", false],
            ["src/test/wow/test/nein", false],
            ["src/test/logs/tml.txt", true],
            ["src/test/logs/asdasd.txt", true],
            ["logs/asdasd.txt", false],
            ["dist/index.js", false],
            ["dist/index.d.ts", false],
            ["dist/assets.js", false],
            ["dist/assets.d.ts", false],
            ["node_modules/typescript/package.json", false],
            ["node_modules/typescript/package-lock.json", false],
            ["node_modules/typescript/bin.js", false],
            ["node_modules/test/package.json", false],
            ["node_modules/test/package-lock.json", false],
            ["node_modules/test/dist/bin.js", false],
            ["node_modules/test/src/bin.ts", false],
            ["node_modules/wow/package.json", false],
            ["node_modules/wow/package-lock.json", false],
            ["node_modules/wow/bin/bin", false],
            ["node_modules/wow/todo/.keep", false],
            ["node_modules/wow/none/.gitkeep", false],
            ["node_modules/wow/klavir/.gitkeep", false],
            ["node_modules/wow/validator/todo.txt", false],
            ["src/index.ts", true],
            ["src/assets.js", true],
            ["package.json", false],
            ["package-lock.json", false],
            ["tsconfig.json", false],
            ["build.sh", false],
            ["start.sh", false],
            [".gitignore", false],
            ["test/.gitignore", false],
            ["ghdfghdfghdf/sdfsadf/fsdfsf/fg/g/g/.gitignore", false],
            [".dockerignore", false],
            ["scripts/build.sh", false],
            ["scripts/start.sh", false],
            ["LICENSE", false],
            ["README.md", false],
        ]

        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testMatchPathSelector(
                    testPaths[index][0],
                    testPaths[index][1],
                    testPattern,
                    index,
                    "SourceScriptPathShape",
                    false
                ),
                "Error on values: " + testPaths[index][0] + ", " + testPaths[index][1]
            ).is.false
        }
    })
    it("match .gitignore PathScript Pattern tests", () => {
        const gitignore = parsePathSelector(`
        dist
        node_modules
        !.keep
        !.gitkeep
        **/.gitignore
    `)

        let testPaths: [string, boolean][]

        testPaths = [
            ["src/test.json", false],
            ["src/test/test.json", false],
            ["test/test.json", false],
            ["src/test/tml.txt", false],
            ["src/test/twowowow", false],
            ["src/test/wow/test/nein", false],
            ["src/test/logs/tml.txt", false],
            ["src/test/logs/asdasd.txt", false],
            ["logs/asdasd.txt", false],
            ["dist/index.js", true],
            ["dist/index.d.ts", true],
            ["dist/assets.js", true],
            ["dist/assets.d.ts", true],
            ["node_modules/typescript/package.json", true],
            ["node_modules/typescript/package-lock.json", true],
            ["node_modules/typescript/bin.js", true],
            ["node_modules/test/package.json", true],
            ["node_modules/test/package-lock.json", true],
            ["node_modules/test/dist/bin.js", true],
            ["node_modules/test/src/bin.ts", true],
            ["node_modules/wow/package.json", true],
            ["node_modules/wow/package-lock.json", true],
            ["node_modules/wow/bin/bin", true],
            ["node_modules/wow/todo/.keep", true],
            ["node_modules/wow/none/.gitkeep", true],
            ["node_modules/wow/klavir/.gitkeep", true],
            ["node_modules/wow/validator/todo.txt", true],
            ["src/index.ts", false],
            ["src/assets.js", false],
            ["package.json", false],
            ["package-lock.json", false],
            ["tsconfig.json", false],
            ["build.sh", false],
            ["start.sh", false],
            [".gitignore", true],
            ["test/.gitignore", true],
            ["ghdfghdfghdf/sdfsadf/fsdfsf/fg/g/g/.gitignore", true],
            [".dockerignore", false],
            ["scripts/build.sh", false],
            ["scripts/start.sh", false],
            ["LICENSE", false],
            ["README.md", false],
        ]

        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testMatchPathSelector(
                    testPaths[index][0],
                    testPaths[index][1],
                    gitignore,
                    index,
                    "GitignoreScriptPathShape",
                    false
                ),
                "Error on values: " + testPaths[index][0] + ", " + testPaths[index][1]
            ).is.false
        }
    })
    it("match dockerignore PathScript Pattern tests", () => {
        const dockerignore = parsePathSelector(`
        *
        !src
        !package.json
        !package-lock.json
        !tsconfig.json
    `)

        let testPaths: [string, boolean][]

        testPaths = [
            ["src/test.json", false],
            ["src/test/test.json", false],
            ["test/test.json", true],
            ["src/test/tml.txt", false],
            ["src/test/twowowow", false],
            ["src/test/wow/test/nein", false],
            ["src/test/logs/tml.txt", false],
            ["src/test/logs/asdasd.txt", false],
            ["logs/asdasd.txt", true],
            ["dist/index.js", true],
            ["dist/index.d.ts", true],
            ["dist/assets.js", true],
            ["dist/assets.d.ts", true],
            ["node_modules/typescript/package.json", true],
            ["node_modules/typescript/package-lock.json", true],
            ["node_modules/typescript/bin.js", true],
            ["node_modules/test/package.json", true],
            ["node_modules/test/package-lock.json", true],
            ["node_modules/test/dist/bin.js", true],
            ["node_modules/test/src/bin.ts", true],
            ["node_modules/wow/package.json", true],
            ["node_modules/wow/package-lock.json", true],
            ["node_modules/wow/bin/bin", true],
            ["node_modules/wow/todo/.keep", true],
            ["node_modules/wow/none/.gitkeep", true],
            ["node_modules/wow/klavir/.gitkeep", true],
            ["node_modules/wow/validator/todo.txt", true],
            ["src/index.ts", false],
            ["src/assets.js", false],
            ["package.json", false],
            ["package-lock.json", false],
            ["tsconfig.json", false],
            ["build.sh", true],
            ["start.sh", true],
            [".gitignore", true],
            ["test/.gitignore", true],
            ["ghdfghdfghdf/sdfsadf/fsdfsf/fg/g/g/.gitignore", true],
            [".dockerignore", true],
            ["scripts/build.sh", true],
            ["scripts/start.sh", true],
            ["LICENSE", true],
            ["README.md", true],
        ]

        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testMatchPathSelector(
                    testPaths[index][0],
                    testPaths[index][1],
                    dockerignore,
                    index,
                    "DockerignoreScriptPathShape",
                    false
                ),
                "Error on values: " + testPaths[index][0] + ", " + testPaths[index][1]
            ).is.false
        }
    })
    it("match node modules PathScript Pattern tests", () => {
        const nodeModules = parsePathSelector(`
        node_modules/test
        node_modules/cmdy
        node_modules/a
    `)

        let testPaths: [string, boolean][]

        testPaths = [
            ["src/test.json", false],
            ["src/test/test.json", false],
            ["node_modules/test", true],
            ["node_modules/typenvy", false],
            ["node_modules/a", true],
            ["README.md", false],
        ]

        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testMatchPathSelector(
                    testPaths[index][0],
                    testPaths[index][1],
                    nodeModules,
                    index,
                    "NodeModulesScriptPathShape",
                    false
                )
            ).is.false
        }
    })
    it("match negated PathScript Pattern tests", () => {
        const nodeModules = parsePathSelector(`
        !node_modules/test
        !node_modules/*/*
        !src/test.json
    `)

        let testPaths: [string, boolean][]

        testPaths = [
            ["src/test.json", false],
            ["src/test/test.json", true],
            ["node_modules/test", false],
            ["node_modules/typenvy", true],
            ["node_modules/a", true],
            ["README.md", true],
        ]

        for (let index = 0; index < testPaths.length; index++) {
            expect(
                testMatchPathSelector(
                    testPaths[index][0],
                    testPaths[index][1],
                    nodeModules,
                    index,
                    "NodeModulesScriptPathShape",
                    true
                ),
                "Error on values: " + testPaths[index][0] + ", " + testPaths[index][1]
            ).is.false
        }
    })
})

export function testPathShape(
    path: string,
    expect: boolean,
    pattern: PathShape,
    index: number,
    name: string,
): boolean {
    if (
        matchPathShape(
            path,
            pattern,
        ) != expect
    ) {
        console.error("=========================#\n" + name + ": Test case [" + index + "] failed: ", {
            path,
            expect,
            pattern,
            index
        })
        return true
    }
    return false
}

export function testMatchPathSelector(
    path: string,
    expect: boolean,
    pathSelector: PathSelector,
    index: number,
    name: string,
    matchByDefault: boolean = false,
): boolean {
    if (
        matchPathSelector(
            path,
            pathSelector,
            matchByDefault
        ) != expect
    ) {
        console.error("=========================#\n" + name + ": Test case [" + index + "] failed: ", {
            path,
            expect,
            pathSelector,
            index
        })
        return true
    }
    return false
}
