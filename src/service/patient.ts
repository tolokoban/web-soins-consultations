import Tfw from 'tfw'
import { IPatient, IPatientSummary, IRecord } from '../types'
import FileSystem from "./file-system"

export default { getAllPatients, getPatient, setPatient }

interface IPatientsFile {
    count: number,
    records: { [key: string]: IRecord }
}

const PATIENTS_FILENAME = 'data/patients.json'

async function getAllPatients(): Promise<IPatientSummary[]> {
    try {
        const patientsFileContent = await FileSystem.readText(PATIENTS_FILENAME)
        const patientsFile = JSON.parse(patientsFileContent) as IPatientsFile
        const listToSort: Array<[string, string, IRecord]> =
            Object.keys(patientsFile.records)
                .map(key => patientsFile.records[key])
                .map((record: IRecord) => {
                    const { id } = record
                    const label = `${
                        record["#PATIENT-LASTNAME"]
                        }\t${
                        record["#PATIENT-FIRSTNAME"]
                        }\t${
                        record["#PATIENT-SECONDNAME"]
                        }`
                    return [id, label, record]
                })
        const sortedList = listToSort.sort((a: any[], b: any[]) => {
            const [A] = a
            const [B] = b
            if (A < B) return -1
            if (A > B) return +1
            return 0
        })
        return sortedList
            .map(item => item[2])
            .map(recordToPatientSummary)
    }
    catch (ex) {
        console.error(`Unable to load "${PATIENTS_FILENAME}"!`, ex)
        return []
    }
}


async function getPatient(id: string, path = "data"): Promise<IPatient> {
    try {
        const patientContent = await FileSystem.readText(`${path}/${id}/patient.json`)
        const patient = JSON.parse(patientContent) as IPatient
        return patient
    }
    catch (ex) {
        console.error(`Unable to load patient #${id}!`, ex)
        throw ex
    }
}


async function setPatient(patient: IPatient): Promise<IPatient> {
    try {
        const patientContent = JSON.stringify(patient)
        await FileSystem.writeText(`data/${patient.id}/patient.json`, patientContent)
        return patient
    }
    catch (ex) {
        console.error(`Unable to save patient #${patient.id}!`, ex)
        throw ex
    }
}


function recordToPatientSummary(record: IRecord): IPatientSummary {
    return {
        id: record.id,
        lastname: Tfw.Util.normalizeLastname(record["#PATIENT-LASTNAME"] || "?"),
        firstname: Tfw.Util.normalizeFirstname(record["#PATIENT-FIRSTNAME"] || "?"),
        secondname: Tfw.Util.normalizeFirstname(record["#PATIENT-SECONDNAME"] || ""),
        gender: record["#PATIENT-GENDER"],
        size: Tfw.Converter.Integer(record["#PATIENT-SIZE"], 0),
        birth: new Date(1000 * Tfw.Converter.Integer(record["#PATIENT_BIRTH"], 0))
    }
}
