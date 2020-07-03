import CheckSums from './check-sums'
import FileSystem from './file-system'

const FS = require('fs')
const Path = require('path')
const Chalk = require('chalk')

const PACKAGE_REL_PATH = "_PACKAGE_"


async function applyIfExists(path: string) {
    console.log(Chalk.bold.cyan("Apply previously downloaded updates, if any..."))
    const pkgPath = Path.resolve(path, PACKAGE_REL_PATH)
    if (!FS.existsSync(pkgPath)) {
        FS.mkdirSync(pkgPath)
        console.log(`  > "${PACKAGE_REL_PATH}" not found in "${path}"!`)
        return
    }

    const checkSums = await CheckSums.loadFromFile(pkgPath)
    if (checkSums.length === 0) {
        console.log("  > Nothing to update.")
        return
    }

    console.log(`  > Cleaning "${Chalk.gray(path)}"...`)
    await FileSystem.cleanPath(path)
    for (const chksum of checkSums) {
        const filename = chksum.path
        console.log(`  > Copy "${Chalk.gray(filename)}"`)
        await FileSystem.copyFile(
            Path.resolve(pkgPath, filename),
            Path.resolve(path, filename)
        )
    }
    console.log(`  > Cleaning "${Chalk.gray(pkgPath)}"...`)
    await FileSystem.cleanPath(pkgPath)
}


export default {
    applyIfExists,
    PACKAGE_REL_PATH
}
