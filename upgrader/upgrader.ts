import Errors from './mod/errors'
import Params from './mod/params'
import Remote from './mod/remote'
import Update from './mod/update'
import Webkit from './mod/webkit'

async function start() {
    try {
        const { url, path } = Params.parse()
        await Update.applyIfExists(path)
        await Remote.execFullDownloadIfNeeded(path, url)
        Webkit.exec(path)
        const remote = Remote.create(path, url)
        if (!remote) return
    } catch (ex) {
        Errors.print(ex)
    }
}

start()
