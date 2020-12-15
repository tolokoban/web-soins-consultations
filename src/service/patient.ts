/**
 * Patients files are stored locally in the "data/" directory.
 * This folder contains an index file named "patients.json"
 * which type is IPatientsFile.
 *
 * Every patient has a unique id which is used as folder's name
 * to store the file "patient.json" of type IPatient.
 */


import { IPatient, IPatientSummary, IRecord, IConsultation } from '../types'
import FileSystem from "./file-system"
import PatientManager from '../manager/patient'
import Guid from '../guid'

export default {
    deletePatient,
    getAllPatients, getPatient, getPatientFolder, getSummary,
    exists, setPatient
}

interface IPatientsFile {
    count: number,
    records: { [key: string]: IRecord }
}

const ROOT_DIRECTORY = '.'
const PATIENTS_FILENAME = `${ROOT_DIRECTORY}/patients.json`

const PATIENTS = new Map<string, IPatient>()

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
            .map(PatientManager.getSummaryFromRecord)
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
        console.info("getPatient() id=", id)
        if (PATIENTS.has(id)) {
            const cachedPatient = PATIENTS.get(id) as IPatient
            console.log(`Found Patient #${id} in cache!`, cachedPatient)
            return cachedPatient
        }
        const patientContent = await FileSystem.readText(
            `${path}/${id}/patient.json`)
        const patient = JSON.parse(patientContent) as IPatient
        sanitizePatient(patient)
        PATIENTS.set(id, patient)
        console.log("Loaded patient: ", patient)
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
        const patientContent = JSON.stringify(sanitizePatient(patient))
        addUniqueIdIfMissing(patient)
        await FileSystem.writeText(`./${patient.id}/patient.json`, patientContent)
        const patientsFile = await loadPatientsFile()
        addPatientToPatientsFile(patient, patientsFile)
        await savePatientsFile(patientsFile)

        const id = patient.id
        if (PATIENTS.has(id)) {
            PATIENTS.delete(id)
        }
        PATIENTS.set(id, patient)

        return patient
    }
    catch (ex) {
        console.error(`Unable to save patient #${patient.id}!`, ex)
        throw ex
    }
}

/**
 * Return the folder of a specific patient.
 * Can be used to store patient prescriptions documents, for instance.
 */
function getPatientFolder(id: string, path = "."): string {
    return `${path}/data/${id}/`
}

async function deletePatient(patientId: string) {
    try {
        const patientsFile = await loadPatientsFile()
        removePatientFromPatientsFile(patientId, patientsFile)
        await savePatientsFile(patientsFile)
        await FileSystem.deleteFolder(`./${patientId}`)
        if (PATIENTS.has(patientId)) {
            PATIENTS.delete(patientId)
        }
    }
    catch (ex) {
        console.error(`Unable to delete patient #${patientId}!`, ex)
        throw ex
    }
}


function getSummary(patient: IPatient): IPatientSummary {
    return PatientManager.getSummary(patient)
}


/**
 * If "patient.id" is missing, create a new unique one.
 */
function addUniqueIdIfMissing(patient: IPatient) {
    if (typeof patient.id === 'string' && patient.id.length > 0) return
    patient.id = Guid.create()
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


function removePatientFromPatientsFile(patientId: string, patientsFile: IPatientsFile) {
    delete patientsFile.records[patientId]
}


function sanitizePatient(patient: IPatient): IPatient {
    for (const admission of patient.admissions) {
        for (const consultation of admission.visits) {
            if (
                typeof consultation.uuid !== 'string'
                || consultation.uuid.length === 0
            ) {
                consultation.uuid = Guid.create()
            }
            if (typeof consultation.version !== 'number') {
                consultation.version = 1
            }
        }
    }
    return patient
}
