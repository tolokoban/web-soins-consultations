import Update from './update'
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
    cleanPath,
    copyFile,
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


function copyFile(srcPath: string, dstPath: string) {
    return new Promise((resolve, reject) => {
        if (!FS.existsSync(srcPath)) {
            return reject(`File not found: "${srcPath}"!`)
        }
        const dirname = Path.dirname(dstPath)
        mkdirp(dirname, (err: any) => {
            if (err) reject(err)
            try {
                const buffer = FS.readFileSync(srcPath)
                FS.writeFileSync(dstPath, buffer)
            } catch (ex) {
                reject(ex)
            }
            resolve()
        })
    })
}


async function cleanPath(path: string) {
    const pathesOfFolderToSkip = [
        Path.resolve(path, "data"),
        Path.resolve(path, Update.PACKAGE_REL_PATH)
    ]
    const filesToRemove: string[] = []
    const foldersToRemove: string[] = []
    const foldersToVisit: string[] = [path]
    while (foldersToVisit.length > 0) {
        const currentFolder = foldersToVisit.pop()
        if (!currentFolder) continue
        if (currentFolder !== path) {
            foldersToRemove.unshift(currentFolder)
        }
        const dirInfo = await readDir(currentFolder)

        filesToRemove.push(
            ...dirInfo.files.map(base => Path.resolve(dirInfo.path, base))
        )
        foldersToVisit.push(
            ...dirInfo.folders
                .map(base => Path.resolve(dirInfo.path, base))
                .filter(path => pathesOfFolderToSkip.indexOf(path) === -1)
        )
    }
    console.log(`    > Deleting ${filesToRemove.length} file${filesToRemove.length > 1 ? "s" : ""}...`)
    for (const file of filesToRemove) {
        console.log(`      > ${file}`)
        await deleteFile(file)
    }
    console.log(`    > Deleting ${foldersToRemove.length} folder${foldersToRemove.length > 1 ? "s" : ""}...`)
    for (const folder of foldersToRemove) {
        console.log(`      > ${folder}`)
        await deleteFolder(folder)
    }
}
