/**
 * Patients files are stored locally in the "data/" directory.
 * This folder contains an index file named "patients.json"
 * which type is IPatientsFile.
 *
 * Every patient has a unique id which is used as folder's name
 * to store the file "patient.json" of type IPatient.
 */


import Tfw from 'tfw'
import { IPatient, IPatientSummary, IRecord } from '../types'
import FileSystem from "./file-system"
import Structure from '../structure'
import Guid from '../guid'

export default { getAllPatients, getPatient, getSummary, exists, setPatient }

interface IPatientsFile {
    count: number,
    records: { [key: string]: IRecord }
}

const ROOT_DIRECTORY = '.'
const PATIENTS_FILENAME = `${ROOT_DIRECTORY}/patients.json`


/**
 * @return A list of all the patients summaries.
 */
async function getAllPatients(): Promise<IPatientSummary[]> {
    try {
        const patientsFile = await loadPatientsFile()
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


function exists(id: string): boolean {
    const patientFilename = `${ROOT_DIRECTORY}/${id}/patient.json`
    return FileSystem.exists(patientFilename)
}

async function getPatient(id: string, path = "."): Promise<IPatient> {
    try {
        const patientContent = await FileSystem.readText(
            `${path}/${id}/patient.json`)
        const patient = JSON.parse(patientContent) as IPatient
        return patient
    }
    catch (ex) {
        console.error(`Unable to load patient #${id}!`, ex)
        throw ex
    }
}


/**
 * Store the patient to disk.
 * If such a patient already exist, it will be overwritten.
 */
async function setPatient(patient: IPatient): Promise<IPatient> {
    try {
        const patientContent = JSON.stringify(patient)
        addUniqueIdIfMissing(patient)
        await FileSystem.writeText(`./${patient.id}/patient.json`, patientContent)
        const patientsFile = await loadPatientsFile()
        addPatientToPatientsFile(patient, patientsFile)
        await savePatientsFile(patientsFile)
        return patient
    }
    catch (ex) {
        console.error(`Unable to save patient #${patient.id}!`, ex)
        throw ex
    }
}


function getSummary(patient: IPatient): IPatientSummary {
    return recordToPatientSummary(patient.data)
}


/**
 * If ".id" is missing, create a new unique one.
 */
function addUniqueIdIfMissing(patient: IPatient) {
    if (typeof patient.id === 'string' && patient.id.length > 0) return
    patient.id = Guid.create()
}


function recordToPatientSummary(record: IRecord): IPatientSummary {
    return {
        id: record.id,
        lastname: Tfw.Util.normalizeLastname(record["#PATIENT-LASTNAME"] || "?"),
        firstname: Tfw.Util.normalizeFirstname(record["#PATIENT-FIRSTNAME"] || "?"),
        secondname: Tfw.Util.normalizeFirstname(record["#PATIENT-SECONDNAME"] || ""),
        gender: record["#PATIENT-GENDER"],
        country: Structure.getValueCaption("#COUNTRY", record["#PATIENT-COUNTRY"]),
        size: Tfw.Converter.Integer(record["#PATIENT-SIZE"], 0),
        birth: new Date(1000 * Tfw.Converter.Integer(record["#PATIENT_BIRTH"], 0))
    }
}


async function loadPatientsFile(): Promise<IPatientsFile> {
    try {
        const patientsFileContent = await FileSystem.readText(PATIENTS_FILENAME)
        return JSON.parse(patientsFileContent) as IPatientsFile
    } catch (ex) {
        const file: IPatientsFile = {
            count: 0,
            records: {}
        }
        return file
    }
}


async function savePatientsFile(patientsFile: IPatientsFile) {
    await FileSystem.writeText(PATIENTS_FILENAME, JSON.stringify(patientsFile))
}


function addPatientToPatientsFile(patient: IPatient, patientsFile: IPatientsFile) {
    patientsFile.records[patient.id] = {
        ...patient.data,
        id: patient.id
    }
}
