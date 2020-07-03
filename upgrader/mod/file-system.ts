import Errors from './errors'
import mkdirp from './mkdirp'

const FS = require('fs')
const Path = require('path')
const Chalk = require('chalk')

interface IDirContent {
    folders: string[]
    files: string[]
    path: string
}

interface IDirectoryEntry {
    isDirectory(): boolean
    isFile(): boolean
    name: string
}

export default {
    deleteFile,
    deleteFolder,
    readDir,
    writeBuffer
}


function readDir(path: string): Promise<IDirContent> {
    return new Promise(resolve => {
        FS.readdir(
            path,
            { withFileTypes: true },
            (err: any, entries: IDirectoryEntry[]) => {
                const result: IDirContent = {
                    path,
                    files: [],
                    folders: []
                }
                if (err) {
                    Errors.print(err)
                } else {
                    result.files = entries
                        .filter(entry => entry.isFile())
                        .map(entry => entry.name)
                    result.folders = entries
                        .filter(entry => entry.isDirectory())
                        .map(entry => entry.name)
                }
                resolve(result)
            }
        )
    })
}

function deleteFile(path: string) {
    return new Promise(resolve => {
        FS.unlink(path, (err: any) => {
            if (err) {
                console.log(Chalk.bold.red("Unable to delete this file:"), Chalk.red(path))
                console.log(err)
            }
            resolve(path)
        })
    })
}

function deleteFolder(path: string) {
    return new Promise(resolve => {
        FS.rmdir(path, { maxRetries: 3 }, (err: any) => {
            if (err) {
                console.log(Chalk.bold.red("Unable to delete this file:"), Chalk.red(path))
                console.log(err)
            }
            resolve(path)
        })
    })
}

function writeBuffer(path: string, buffer) {
    return new Promise((resolve, reject) => {
        const dirname = Path.dirname(path)
        mkdirp(dirname, (err: any) => {
            if (err) reject(err)
            FS.writeFileSync(path, buffer)
            resolve()
        })
    })
}
