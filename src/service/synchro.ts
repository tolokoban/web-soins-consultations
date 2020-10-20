import Tfw from 'tfw'
import Settings from '../settings'
import { ISynchroStatus, IPatientSummary } from '../types'
import PatientService from './patient'

export default {
    synchro
}

type ILogger = (msg: string) => void

async function synchro(log: ILogger) {
    const SLEEP_BETWEEN_RETRIES = 180000
    while (true) {
        try {
            log("Synchronisation en cours...")
            const status = await getStatus()
            const patients = await PatientService.getAllPatients()
            await uploadMissingPatients(status, patients, log)
            await updateConsultations(status, patients, log)
        } catch (ex) {
            console.error(ex)
            log(`_${ex}_`)
        }
        log("On attend 3 minutes avant nouvel essai.")
        await Tfw.Async.sleep(SLEEP_BETWEEN_RETRIES)
    }
}


async function uploadMissingPatients(
    status: ISynchroStatus, patients: IPatientSummary[], log: ILogger
) {
    const patientsToUpload = patients.filter(
        p => typeof status[p.id] === 'undefined'
    )
    log(`Nouveau patients à envoyer au serveur: __${patientsToUpload.length}__ / ${patients.length}`)
    // @TODO Send patients to remote server.
}

/**
 * Look for all local consultations and sent to the server the one that are new.
 * The "version" attribute will help in that.
 */
async function updateConsultations(
    status: ISynchroStatus, patients: IPatientSummary[], log: ILogger
) {
    for (const patientSummary of patients) {
        const patient = await PatientService.getPatient(patientSummary.id)
        for (const admission of patient.admissions) {
            for (const cunsultation of admission.visits) {
                
            }
        }
    }
}


async function getStatus(): Promise<ISynchroStatus> {
    const code = `${Settings.organizationId}-${Settings.secretCode}`
    const result = await exec("synchro2", { cmd: "status", code })
    if (result === -3) throw `Code invalide : ${Settings.secretCode}`
    if (typeof result !== 'string') throw `Unknonw result: ${JSON.stringify(result)}`

    const status: ISynchroStatus = {}
    const lines = result.split("\n")
    for (const line of lines) {
        const [patientKey, admissions] = line.split(":")
        const patient: { [key: string]: number } = {}
        status[patientKey] = patient
        for (const admission of admissions.split(";")) {
            const [key, version] = admission.split(",")
            patient[key] = Tfw.Converter.Integer(version, 0)
        }
    }
    return status
}

function exec(serviceName: string, params: {}) {
    const WebService = Tfw.WebService.create(
        Settings.remoteServer
    )
    return WebService.exec(serviceName, params)
}