const Path = require('path')

interface IParams {
    url: string
    path: string
}

export default {
    parse(): IParams {
        if (process.argv.length < 4) {
            console.error(`
The Upgrader needs two params:
    1) The path of the application code.
    2) The URL of the updates.
`)
            process.exit(1)
        }
        const [, , path, url] = process.argv
        return {
            url,
            path: Path.resolve(process.cwd(), path)
        }
    }
}
