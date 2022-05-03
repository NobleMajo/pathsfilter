import { promises as fs } from "fs"
import * as path from "path"

export let cwd: string
if (
    typeof process == "object" &&
    typeof process.cwd == "function"
) {
    try {
        cwd = process.cwd()
    } catch (err) {
    }
}
if (
    typeof cwd != "string" ||
    cwd.length <= 0
) {
    cwd = "/"
}

export function formatAbsolutePath(
    filePath: string,
    cwd: string = process.cwd()
): string {
    filePath = filePath.split("\\").join("/")
    if (!filePath.startsWith("/")) {
        filePath = cwd + "/" + filePath
    }
    return "/" + formatPath2(filePath)
}

export function formatPath2(filePath: string): string {
    filePath = filePath.split("\\").join("/")
    while (
        filePath.startsWith("/") ||
        filePath.startsWith(" ")
    ) {
        filePath = filePath.substring(1)
    }
    while (
        filePath.endsWith("/") ||
        filePath.endsWith(" ")
    ) {
        filePath = filePath.slice(0, -1)
    }
    return path.join(...filePath.split("/")).split("\\").join("/")
}

export interface PathStat {
    name: string,
    relativePath: string,
    rootPath: string,
    isFile: boolean,
    isDir: boolean,
}

export interface RecursivePathStatChildren {
    [name: string]: RecursivePathStat
}

export interface RecursivePathStat extends PathStat {
    children: RecursivePathStatChildren
    parent: RecursivePathStat | undefined
}

export interface ExtendedDirScanOptions {
    depth?: number
    cwd?: string
    pathSelector?: PathSelector,
    matchByDefault?: boolean
    current?: RecursivePathStat,
    parent?: RecursivePathStat
}

export interface ExtendedDirScanSettings {
    depth: number
    cwd: string
    pathSelector: PathSelector | undefined,
    matchByDefault: boolean
    current: RecursivePathStat | undefined,
    parent: RecursivePathStat | undefined
}

export const defaultExtendedDirScanSettings: ExtendedDirScanSettings = {
    depth: 5,
    cwd: process.cwd(),
    pathSelector: undefined,
    matchByDefault: false,
    current: undefined,
    parent: undefined
}

export async function extendedDirScan(
    path: string,
    options?: ExtendedDirScanOptions
): Promise<RecursivePathStat> {
    const settings: ExtendedDirScanSettings = {
        ...defaultExtendedDirScanSettings,
        ...options,
    }
    path = formatPath2(path)
    let current: RecursivePathStat
    if (!settings.current) {
        const stat = await fs.stat(path)
        current = {
            name: path.split("/").pop() as string,
            rootPath: formatAbsolutePath(path, settings.cwd),
            relativePath: path,
            isFile: stat.isFile(),
            isDir: stat.isDirectory(),
            children: {},
            parent: settings.parent
        }
    } else {
        current = settings.current
    }
    if (settings.parent) {
        settings.parent.children[current.name] = current
    }
    if (current.isDir && settings.depth > 0) {
        const files = await fs.readdir(
            path,
            {
                encoding: "utf-8",
                withFileTypes: true,
            }
        )
        await Promise.all(files.map(
            async (file) => {
                const childPath = path + "/" + file.name
                if (settings.pathSelector) {
                    if (
                        !matchPathSelector(
                            childPath,
                            settings.pathSelector,
                            settings.matchByDefault
                        )
                    ) {
                        return
                    }
                }
                const child: RecursivePathStat = {
                    name: file.name,
                    rootPath: formatAbsolutePath(childPath, settings.cwd),
                    relativePath: childPath,
                    isFile: file.isFile(),
                    isDir: file.isDirectory(),
                    children: {},
                    parent: settings.current,
                }
                await extendedDirScan(
                    childPath,
                    {
                        ...settings,
                        depth: settings.depth - 1,
                        current: child,
                        parent: current
                    }
                )
            }
        ))
    }
    return current
}

export function parseRecursiveFilelist(
    recursivePathStat: RecursivePathStat,
): string[] {
    const result: string[] = []
    if (recursivePathStat.isFile) {
        result.push(recursivePathStat.relativePath)
    } else if (recursivePathStat.isDir) {
        Object.values(recursivePathStat.children).forEach(
            (v) => parseRecursiveFilelist(v).forEach(
                (v) => result.push(v)
            )
        )
    }
    return result
}

export function parseAbsoluteRecursiveFilelist(
    recursivePathStat: RecursivePathStat,
    cwd: string = process.cwd()
): string[] {
    return parseRecursiveFilelist(recursivePathStat).map(
        (v) => formatAbsolutePath(
            v,
            cwd
        )
    )

}

// export type PathPattern that is a string array
// Example raw path patterns '**/*.ts', '*', '!**/node_modules/**', '!.test', 'README.md', '*/*/*/test.ts' and '**/test/**/*.test.sh'
// A PathPattern is a tuple of one or more strings
// The string parts that represent the path parts splitted by the unix path separator ("/") 
// A pathscript is a list of PathPatterns that can be used to check if a path matches a path script
// A "*" represents any path in the same folter
// A "**" represents any path in nested any folder
export type PathShape = [string, ...string[]]
export type SelectPathShape = [boolean, PathShape]
export type PathSelector = SelectPathShape[]

export function parsePathShape(
    pathShape: string
): PathShape {
    while (pathShape.startsWith(" ")) {
        pathShape = pathShape.substring(1)
    }
    while (pathShape.endsWith(" ")) {
        pathShape = pathShape.slice(0, -1)
    }

    if (pathShape.includes(" ")) {
        throw new Error("Blank space in ignore pattern: '" + pathShape + "'")
    }

    pathShape = pathShape
        .split("\\").join("/")
        .split("//").join("/")

    while (
        pathShape.includes("**/**") ||
        pathShape.includes("**/*") ||
        pathShape.includes("*/**")
    ) {
        pathShape = pathShape
            .split("**/**").join("**")
            .split("**/*").join("**")
            .split("*/**").join("**")
    }

    const parts = pathShape.split("/")

    if (parts.length < 1) {
        throw new Error("Invalid path shape: Length of parts is 0 '" + pathShape + "'")
    }
    for (let index = 0; index < parts.length; index++) {
        if (parts[index].length == 0) {
            throw new Error("Invalid path shape: Length of part " + (index + 1) + " in '" + pathShape + "' is 0")
        }
    }

    return [
        parts[0],
        ...parts.slice(1),
    ]
}

export function stringifyPathShape(
    pathShape: PathShape
): string {
    return pathShape.join("/")
}

export function parseSelectPathShape(
    selectPathShape: string
): SelectPathShape {
    let filter: boolean = false
    while (selectPathShape.startsWith(" ")) {
        selectPathShape = selectPathShape.substring(1)
    }
    if (selectPathShape.startsWith("!")) {
        selectPathShape = selectPathShape.substring(1)
        filter = true
    }
    return [
        filter,
        parsePathShape(selectPathShape),
    ]
}

export function stringifySelectPathShape(
    selectPathShape: SelectPathShape
): string {
    return (selectPathShape[0] ? "!" : "") +
        stringifyPathShape(selectPathShape[1])
}

export function parsePathSelector(
    slectorScript: string
): PathSelector {
    return slectorScript
        .split("\n")
        .map((v) => {
            while (v.startsWith(" ")) {
                v = v.substring(1)
            }
            return v
        })
        .filter((v) => v.length != 0)
        .map((v) => parseSelectPathShape(v))
}

export function stringifyPathSelector(
    pattern: PathSelector
): string {
    return pattern.map(
        (v) => stringifySelectPathShape(v)
    ).join("\n")
}

export function matchPathShape(
    path: string,
    pathShape: PathShape,
): boolean {
    const pathParts = formatPath2(path)
        .split("/")
        .filter((v) => v.length > 0)

    if (pathParts.length == 0 || pathShape.length == 0) {
        return false
    }

    let patternIndex: number = 0
    let pathIndex: number = 0

    while (pathIndex < pathParts.length && patternIndex < pathShape.length) {
        while (pathShape[patternIndex] == "*") {
            pathIndex++
            patternIndex++
            if (
                pathIndex >= pathParts.length &&
                pathShape.length > pathParts.length
            ) {
                return false
            } else if (
                patternIndex >= pathShape.length &&
                pathParts.length > pathShape.length
            ) {
                return true
            }
        }
        if (pathShape[patternIndex] == "**") {
            if (pathShape.length == 0) {
                return true
            }
            const newPattern: PathShape = [
                pathShape[patternIndex + 1],
                ...pathShape.slice(patternIndex + 2)
            ]
            for (
                let index = pathIndex;
                index < pathParts.length;
                index++
            ) {
                if (
                    matchPathShape(
                        pathParts.slice(index).join("/"),
                        newPattern,
                    )
                ) {
                    return true
                }
            }
            return false
        } else if (pathShape[patternIndex] != pathParts[pathIndex]) {
            return false
        }
        pathIndex++
        patternIndex++
    }
    return true
}

export function matchPathSelector(
    path: string,
    pathSelector: PathSelector,
    matchByDefault: boolean = false,
): boolean {
    let match: boolean = matchByDefault
    for (let index = 0; index < pathSelector.length; index++) {
        const selectPathShape = pathSelector[index]
        if (
            selectPathShape[0] == match &&
            matchPathShape(path, selectPathShape[1])
        ) {
            match = !match
        }
    }
    return match
}

