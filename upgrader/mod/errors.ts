const Chalk = require('chalk')

export default {
    print
}

function print(message: string) {
    const strMessage = typeof message === 'string' ?
        message : JSON.stringify(message, null, '  ')
    const lines = strMessage.split("\n")
    let maxLength = 0
    for (const line of lines) {
        maxLength = Math.max(maxLength, line.length)
    }
    const separator = `+-${repeat('-', maxLength)}-+`
    const output = [
        separator,
        ...lines.map(line => `| ${line}${repeat(' ', maxLength - line.length)} |`),
        separator
    ]
    console.log(Chalk.bgRed.white(output.join("\n")))
}


function repeat(char: string, times: number): string {
    let output = ''
    while (times-- > 0) output = `${output}${char}`
    return output
}
