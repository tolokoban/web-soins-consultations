import mkdirp from './mkdirp'

const FS = window.require('fs')
const Path = window.require('path')

export default { deleteFolder, exists, readText, writeText }

const ROOT = Path.resolve(process.cwd(), "data")

interface IDirectoryEntry {
    name: string
    isFile(): boolean
    isDirectory(): boolean
}

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


function deleteFolder(foldername: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const fullPath = Path.resolve(ROOT, foldername)
        await removeDirectory(fullPath)
    })
}


function removeDirectory(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        FS.readdir(
            path, {
                withFileTypes: true
            },
            async (err: any, entries: IDirectoryEntry[]) => {
                if (err) {
                    return reject(err)
                }
                for (const entry of entries) {
                    const filename = Path.resolve(path, entry.name)
                    if (entry.isFile()) {
                        try {
                            await removeFile(filename)
                        }
                        catch (ex) {
                            reject(ex)
                            return
                        }
                    }
                    else {
                        removeDirectory(filename)
                    }
                }
                FS.rmdir(path, (err: any) => {
                    if (err) reject(err)
                })
                resolve()
            }
        )
    })
}


function removeFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        FS.unlink(path, (err: any) => {
            if (err) reject(err)
            else resolve()
        })
    })
}
