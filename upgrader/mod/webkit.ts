const Path = require('path')
const Chalk = require('chalk')
const ChildProcess = require('child_process')


function exec(path: string) {
    console.log(Chalk.bold.cyan("Starting application..."))
    const command = `nw "${path}"`
    console.log(`  > ${command}`)
    ChildProcess.exec(command)
}


export default {
    exec
}
