/**
 * Deals with anything from the update website.
 *
 */
import Errors from './errors'
import CheckSums from './check-sums'
import FileSystem from './file-system'

const FS = require('fs')
const Path = require('path')
const Chalk = require('chalk')
const fetch = require('node-fetch')

interface ICheckSum {
    path: string
    hash: string
}

async function fetchText(url: string): Promise<string> {
    const response = await fetch(url)
    return await response.text()
}

class Remote {
    constructor(
        private path: string,
        private localCheckSums: ICheckSum[],
        private remoteCheckSums: ICheckSum[]
    ) {
        console.log(`  > Remote files: ${remoteCheckSums.length}`)
        console.log(`  > Local files: ${localCheckSums.length}`)
    }
}


export default {
    /**
     * Given the update website URL, return a promise that resolves
     * in `null` or in a Remote object.
     *
     * `null` means that this URL is not reachable or that `package.txt`
     * does not exist there.
     * In any case, a description of the problem is sent to stderr.
     */
    create(path: string, url: string): Promise<Remote | null> {
        console.log(Chalk.bold.cyan("Checking for updates..."))
        console.log(`  > ${url}`)
        return new Promise(async (resolve) => {
            const packageUrl = `${url}/package.txt`
            try {
                const packageTxtContent = await fetchText(packageUrl)
                const remoteCheckSums = CheckSums.parse(packageTxtContent)
                const localCheckSums = await CheckSums.loadFromFile(path)
                resolve(new Remote(path, localCheckSums, remoteCheckSums))
            } catch (ex) {
                printFetchError(ex, packageUrl)
                resolve(null)
            }
        })
    },

    execFullDownloadIfNeeded
}

/**
 * If there is no "package.txt" in local path, then we need to download everythink.
 */
async function execFullDownloadIfNeeded(path: string, url: string) {
    console.log(Chalk.bold.cyan("Full download..."))
    const localCheckSums = await CheckSums.loadFromFile(path)
    if (localCheckSums.length > 0) {
        console.log("  > No need.")
        return
    }

    const packageUrl = `${url}/package.txt`
    let remoteCheckSums: ICheckSum[] = []
    try {
        const packageTxtContent = await fetchText(packageUrl)
        remoteCheckSums = CheckSums.parse(packageTxtContent)
        if (remoteCheckSums.length === 0) {
            console.log(Chalk.red(`  > Remote "package.txt" is empty!`))
            return
        }
    } catch (ex) {
        printFetchError(ex, packageUrl)
        return
    }

    console.log(`  > Cleaning "${path}"...`)
    await cleanPath(path)

    await execFullDownload(path, url, remoteCheckSums)
}

async function execFullDownload(path: string, url: string, checkSums: ICheckSum[]) {
    for (const checkSum of checkSums) {
        const filename = checkSum.path.startsWith("./") ?
            checkSum.path.substr(2) : checkSum.path
        const fileURL = `${url}/${filename}`
        console.log(`  > Downloading "${fileURL}"...`)
        await downloadTo(fileURL, Path.resolve(path, filename))
    }
}

async function downloadTo(url: string, destinationPath: string): Promise<boolean> {
    try {
        const res = await fetch(url)
        const buffer = await res.buffer()
        await FileSystem.writeBuffer(destinationPath, buffer)
        return true
    } catch (ex) {
        console.error(ex)
        Errors.print(ex)
        return false
    }
}

async function cleanPath(path: string) {
    const pathOfFolderToSkip = Path.resolve(path, "data")
    const filesToRemove: string[] = []
    const foldersToRemove: string[] = []
    const foldersToVisit: string[] = [path]
    while (foldersToVisit.length > 0) {
        const currentFolder = foldersToVisit.pop()
        if (!currentFolder) continue
        if (currentFolder !== path) {
            foldersToRemove.unshift(currentFolder)
        }
        const dirInfo = await FileSystem.readDir(currentFolder)

        filesToRemove.push(
            ...dirInfo.files.map(base => Path.resolve(dirInfo.path, base))
        )
        foldersToVisit.push(
            ...dirInfo.folders
                .map(base => Path.resolve(dirInfo.path, base))
                .filter(path => path !== pathOfFolderToSkip)
        )
    }
    console.log(`    > Deleting ${filesToRemove.length} file${filesToRemove.length > 1 ? "s" : ""}...`)
    for (const file of filesToRemove) {
        console.log(`      > ${file}`)
        await FileSystem.deleteFile(file)
    }
    console.log(`    > Deleting ${foldersToRemove.length} folder${foldersToRemove.length > 1 ? "s" : ""}...`)
    for (const folder of foldersToRemove) {
        console.log(`      > ${folder}`)
        await FileSystem.deleteFolder(folder)
    }
}


function printFetchError(ex: any, url: string) {
    if (typeof ex.code !== 'string') {
        Errors.print(ex)
        return
    }

    switch (ex.code) {
        case "ENOTFOUND":
            return Errors.print(`The network is down or
the following URL does not exist:
            ${ url}`)
        default:
            return Errors.print(ex)
    }
}
