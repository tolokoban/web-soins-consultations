import Errors from './mod/errors'
import Params from './mod/params'
import Remote from './mod/remote'
import Update from './mod/update'
import Webkit from './mod/webkit'

const Chalk = require("chalk")

async function start() {
    try {
        const { url, path } = Params.parse()
        await Update.applyIfExists(path)
        await Remote.execFullDownloadIfNeeded(path, url)
        Webkit.exec(path)
        const remote = await Remote.create(path, url)
        if (!remote) return
        remote.prepareUpdate()
        await remote.execUpdate()
        console.log(Chalk.bold.cyan("Done."))
    } catch (ex) {
        Errors.print(ex)
    }
}

start()
