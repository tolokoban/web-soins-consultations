import Errors from './errors'

const FS = require('fs')
const Path = require('path')
const Chalk = require('chalk')

interface ICheckSum {
    path: string
    hash: string
}

const RX_HASH = /^([0-9a-f]+)[ \t]+(.+)$/g

export default {
    findHashFromPath,
    findPathFromHash,
    loadFromFile,
    parse
}


/**
 * Given a content made of lines with two columns (sha256, filename),
 * return an array of ICheckSum.
 * If the content has bad syntax, an exception will be thrown.
 */
function parse(content: string): ICheckSum[] {
    const checksums: ICheckSum[] = []
    const lines = content.split("\n").map(line => line.trim())
    let lineNum = 0
    for (const line of lines) {
        lineNum++
        if (line.trim().length === 0) continue
        RX_HASH.lastIndex = -1
        const matches = RX_HASH.exec(line)
        if (!matches) {
            throw `Bad hash syntax in "package.txt" at line #${lineNum}:
${line}`
        }
        const [, hash, path] = matches
        checksums.push({ hash, path })
    }
    return checksums
}

async function loadFromFile(path: string): Promise<ICheckSum[]> {
    return new Promise(resolve => {
        try {
            const filename = Path.resolve(path, "package.txt")
            if (!FS.existsSync(filename)) {
                console.log(Chalk.red(`Path not found: ${filename}`))
                return resolve([])
            }
            const content = `${FS.readFileSync(filename)}`
            return resolve(parse(content))
        } catch (ex) {
            Errors.print(ex)
            return []
        }
    })
}

function findPathFromHash(checksums: ICheckSum[], hash: string): string | null {
    for (const checksum of checksums) {
        if (hash === checksum.hash) return checksum.path
    }
    return null
}

function findHashFromPath(checksums: ICheckSum[], path: string): string | null {
    for (const checksum of checksums) {
        if (path === checksum.path) return checksum.hash
    }
    return null
}
