/**
 * Deals with anything from the update website.
 *
 */
import CheckSums from './check-sums'
import Errors from './errors'
import FileSystem from './file-system'
import Update from './update'

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
    private filesToKeep: string[] = []
    private filesToDownload: string[] = []

    constructor(
        private url: string,
        private path: string,
        private localCheckSums: ICheckSum[],
        private remoteCheckSums: ICheckSum[]
    ) {
        console.log(`  > Remote files: ${remoteCheckSums.length}`)
        console.log(`  > Local files: ${localCheckSums.length}`)
    }

    /**
     * `remoteCheckSums` is the list of the new files.
     * `localCheckSums` is the list of the old files.
     *
     */
    prepareUpdate() {
        const { remoteCheckSums, localCheckSums } = this
        const filesToKeep: string[] = []
        const filesToDownload: string[] = []

        for (const remoteChk of remoteCheckSums) {
            // Do not update "package.txt"
            if (remoteChk.path === './package.txt') continue

            const localHash = CheckSums.findHashFromPath(localCheckSums, remoteChk.path)
            if (localHash === remoteChk.hash) {
                // Same hash ~ same file
                filesToKeep.push(remoteChk.path)
            } else {
                // File has changed.
                filesToDownload.push(remoteChk.path)
            }
        }

        this.filesToKeep = filesToKeep
        this.filesToDownload = filesToDownload
    }

    async execUpdate() {
        const { url, path, filesToKeep, filesToDownload } = this
        if (filesToDownload.length === 0) {
            console.log("  > No new upgrade.")
            return
        }
        const destination = Path.resolve(path, Update.PACKAGE_REL_PATH)

        console.log("  > Cleaning destination folder:", destination)
        await FileSystem.cleanPath(destination)

        console.log("  > Files to KEEP:", filesToKeep.length)
        for (const filename of filesToKeep) {
            console.log(`    > Copy "${Chalk.bold(filename)}"...`)
            await FileSystem.copyFile(
                Path.resolve(path, filename),
                Path.resolve(destination, filename)
            )
        }
        console.log("  > Files to DOWNLOAD:", filesToDownload.length)
        for (const filename of filesToDownload) {
            console.log(`    > Download "${Chalk.bold(filename)}"...`)
            await downloadTo(`${url}/${filename}`, Path.resolve(destination, filename))
        }

        // Everything is alright, we can download "package.txt".
        await downloadTo(`${url}/package.txt`, Path.resolve(destination, "package.txt"))
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
                resolve(new Remote(url, path, localCheckSums, remoteCheckSums))
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
    await FileSystem.cleanPath(path)

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
