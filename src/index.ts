import { join } from "path"

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

export function toLinuxPath(path: string): string {
    path = join(
        ...path.split("\\")
            .filter((v) => v.length != 0)
    )
    if (path[0] != "/" && path[1] == ":" && path[2] == "/") {
        path = "/" + path
    }
    return path
}

export const forbiddenWindowsChars = "<>:\"|?*".split("")

export function toWindowsPath(
    path: string,
    forbiddenCharReplacement: string | null = "?"
): string {
    if (forbiddenCharReplacement == null) {
        forbiddenWindowsChars.forEach(
            (v) => {
                if (path.includes(v)) {
                    throw new Error("Forbidden char in windows path: " + path + " char: '" + v + "'")
                }
            }
        )
    } else {
        forbiddenWindowsChars.forEach(
            (v) => {
                path = path.split(v).join(forbiddenCharReplacement)
            }
        )
    }

    path = path.split("/")
        .map((v) => {
            while (v.endsWith(".") || v.endsWith(" ")) {
                v = v.slice(0, -1)
            }
            return v
        })
        .filter((v) => v.length != 0)
        .join("\\")

    return path
}

export function absolutPath(
    path: string,
    cwd: string = toLinuxPath(process.cwd()),
): string {
    path = toLinuxPath(path)
    if (!path.startsWith("/")) {
        path = "/" + join(
            ...cwd.split("/"),
            ...path.split("/")
        )
    }
    return path
}

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
            while (v.endsWith(" ")) {
                v = v.slice(0, -1)
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
    const pathParts = toLinuxPath(path).split("/")

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
            if (patternIndex + 1 >= pathShape.length) {
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
            debugValue = path
            return false
        } else if (pathShape[patternIndex] != pathParts[pathIndex]) {
            return false
        }
        pathIndex++
        patternIndex++
    }
    return true
}

let debugValue = "asd/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/a/asdasödasdka/a/a/a/äölsdaösdla/test.asd"

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

export function normalizeAndMatchPath(
    path: string,
    pathSelector: PathSelector,
    matchByDefault: boolean = false,
    os: "win32" | "linux" = process.platform
): boolean {
    let normalizedPath: string

    if (os === "win32") {
        normalizedPath = toWindowsPath(path)
    } else {
        normalizedPath = toLinuxPath(path)
    }

    return matchPathSelector(normalizedPath, pathSelector, matchByDefault)
}
