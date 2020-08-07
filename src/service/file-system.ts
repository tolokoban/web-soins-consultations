import mkdirp from './mkdirp'

const FS = window.require('fs')
const Path = window.require('path')

export default { exists, readText, writeText }

const ROOT = Path.resolve(process.cwd(), "data")


function exists(filename: string): boolean {
    const fullPath = Path.resolve(ROOT, filename)
    return FS.existsSync(fullPath)
}

/**
 * Read text file in "data/" folder.
 */
function readText(filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const fullPath = Path.resolve(ROOT, filename)
        FS.readFile(fullPath, 'utf-8', (err: any, data: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}


/**
 * Write text file in "data/" folder.
 */
function writeText(filename: string, content: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const fullPath = Path.resolve(ROOT, filename)
        const dirname = Path.dirname(fullPath)
        mkdirp(dirname, (err: any) => {
            if (err) reject(err)
            else FS.writeFile(fullPath, content, 'utf-8', (err: any, data: any) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    })
}
