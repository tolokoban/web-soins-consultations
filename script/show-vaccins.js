const FS = require("fs")

if (process.argv.length < 3) {
    console.error(`\nUsage: node vaccins.js "patient.json"\n`)
    console.error("Display the ID and the vaccins attributes of a patient.\n\n")
    process.exit(-1)
}

function run() {
    const filename = process.argv[2]
    const content = FS.readFileSync(filename).toString()
    const patient = JSON.parse(content)
    const { id, vaccins } = patient
    console.log(`${id}, vaccins:${JSON.stringify(vaccins)}`)
}

run()
