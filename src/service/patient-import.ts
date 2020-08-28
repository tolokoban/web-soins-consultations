import FileSystem from './file-system'
import PatientService from './patient'
import PatientManager from '../manager/patient'
import { IPatient, IPatientSummary, IRecord } from '../types'

export default class PatientImport {
    static async create(patientsFilePath: string): Promise<PatientImport> {
        const content = await FileSystem.readText(patientsFilePath)
        const path = patientsFilePath.substr(
            0, patientsFilePath.length - "patients.json".length)
        return new PatientImport(content, path)
    }

    private readonly _patientsCount: number
    private readonly _records: { [key: string]: IRecord }

    private constructor(content: string, private path: string) {
        try {
            const patients = JSON.parse(content)
            if (typeof patients.count !== 'number') {
                throw Error('Wrong file format: missing "count" attribute!')
            }
            this._patientsCount = patients.count
            if (typeof patients.records !== 'object') {
                throw Error('Wrong file format: missing "records" attribute!')
            }
            if (Array.isArray(patients.records)) {
                throw Error('Wrong file format: "records" must not be an array!')
            }
            this._records = patients.records
            console.info("patients=", patients)
        } catch (ex) {
            console.log(ex)
            throw Error('Unable to parse "patients.json" content!')
        }
    }

    get patientsCount() { return this._patientsCount }

    getPatientBio(index: number): IPatientSummary {
        const records: { [key: string]: IRecord } = this._records
        const keys = Object.keys(records)
        const key = keys[index]
        if (!key) throw Error(`Invalid patient index #${index}!`)
        return PatientManager.getSummaryFromRecord(records[key])
    }

    async getPatient(key: string): Promise<IPatient> {
        const patient = await PatientService.getPatient(key, this.path)
        return patient
    }
}
