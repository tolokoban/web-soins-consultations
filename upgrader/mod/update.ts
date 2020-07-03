/**
 *
 */
const FS = require('fs')
const Path = require('path')
const Chalk = require('chalk')

const PACKAGE_REL_PATH = "_PACKAGE_"


async function applyIfExists(path: string) {
    console.log(Chalk.bold.cyan("Apply previously downloaded updates, if any..."))
    const pkgPath = Path.resolve(path, PACKAGE_REL_PATH)
    if (!FS.existsSync(pkgPath)) {
        FS.mkdirSync(pkgPath)
        console.log(`   > "${PACKAGE_REL_PATH}" not found in "${path}"!`)
        return
    }


}


export default {
    applyIfExists,
    PACKAGE_REL_PATH
}
