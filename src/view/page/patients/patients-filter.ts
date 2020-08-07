import { IPatientSummary } from "../../../types"

export default class PatientsExport {
    private _filteredList: IPatientSummary[]
    // patientSummaries and footPrints must keep the same order!
    private patientSummaries: IPatientSummary[]
    private readonly footPrints: IPatientFootPrint[]

    constructor(patientSummaries: IPatientSummary[]) {
        this.patientSummaries = patientSummaries
        this._filteredList = patientSummaries.slice()
        this.footPrints = patientSummaries.map(p => ({
            id: p.id,
            firstName: simplifyName(p.firstname),
            lastName: simplifyName(p.lastname)
        }))
    }

    filter(lastName: string, firstName: string) {
        const simpleLastName = simplifyName(lastName)
        const simpleFirstName = simplifyName(firstName)

        this._filteredList = this.patientSummaries.filter(
            (patientSummary: IPatientSummary, idx: number) => {
                const item = this.footPrints[idx]
                return match(item.lastName, simpleLastName)
                    && match(item.firstName, simpleFirstName)
            }
        )
    }

    get filteredList() { return this._filteredList.slice() }
}

interface IPatientFootPrint {
    id: string
    firstName: string
    lastName: string
}


const NOT_FOUND = -1


function match(value: string, test: string): boolean {
    if (test.length === 0) return true
    return value.indexOf(test) !== NOT_FOUND
}


const LETTERS_TO_KEEP = "abcdefghijklmnopqrstuvwxyz"
const LETTERS_TO_CHANGE = [
    ["àáäâã", "a"],
    ["èéëêẽ", "e"],
    ["ìíïîĩ", "i"],
    ["òóöôõ", "o"],
    ["ùúüûũ", "u"],
    ["ç", "c"],
    ["€", "e"],
    ["ñ", "n"]
]

function simplifyName(name: string): string {
    let out = ""
    for (const letter of name.toLowerCase()) {
        const replacement = findReplacement(letter)
        if (replacement) {
            out += replacement
        }
        else if (LETTERS_TO_KEEP.indexOf(letter) !== -1) {
            out += letter
        }
    }
    return out
}


/**
 * Look if the letter can be changed by another one.
 * This is used to get rid of accents and other cedillas.
 * @param letter - Must be in lower case.
 * @return `null` if no replacement has been found.
 */
function findReplacement(letter: string): string | null {
    for (const map of LETTERS_TO_CHANGE) {
        const [candidates, replacement] = map
        if (candidates.indexOf(letter) !== NOT_FOUND) {
            return replacement
        }
    }
    return null
}
