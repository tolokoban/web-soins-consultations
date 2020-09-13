import Tfw from 'tfw'
import Guid from '../guid'
import DateUtil from '../date-util'
import { IPatient, IPatientSummary, IConsultation, IRecord } from '../types'

export default {
    createPatientFromSummary,
    getAllConsultationsBefore,
    getConsultationFromUuid,
    getSummary,
    getSummaryFromRecord,
    removeConsultation,
    setSummary,
    updateConsultation
}

function getConsultationFromUuid(patient: IPatient, consultationId: string): IConsultation | null {
    for (const admission of patient.admissions) {
        for (const consultation of admission.visits) {
            if (consultation.uuid === consultationId) {
                return consultation
            }
        }
    }
    console.warn(`No consultation found for Patient ${patient.id} with Id ${consultationId}!`)
    return null
}


function getSummary(patient: IPatient): IPatientSummary {
    patient.data.id = patient.id
    return getSummaryFromRecord(patient.data)
}

/**
 * Update patient with a new summary.
 */
function setSummary(patient: IPatient, patientSummary: IPatientSummary) {
    patient.data["#PATIENT-BIRTH"] = DateUtil.date2seconds(patientSummary.birth)
    patient.data["#PATIENT-COUNTRY"] = patientSummary.country
    patient.data["#PATIENT-FIRSTNAME"] = patientSummary.firstname
    patient.data["#PATIENT-SECONDNAME"] = patientSummary.secondname
    patient.data["#PATIENT-LASTNAME"] = patientSummary.lastname
    patient.data["#PATIENT-GENDER"] = patientSummary.gender
    patient.data["#PATIENT-SIZE"] = patientSummary.size
}

function getSummaryFromRecord(record: IRecord): IPatientSummary {
    const summary: IPatientSummary = {
        id: record.id,
        birth: DateUtil.seconds2date(
            Tfw.Converter.Integer(
                record["#PATIENT-BIRTH"]
            )
        ),
        country: `${record["#PATIENT-COUNTRY"]}`,
        firstname: Tfw.Transform.normalizeName(
            `${record["#PATIENT-FIRSTNAME"]}`
        ),
        gender: Tfw.Converter.Enum<string>(
            record["#PATIENT-GENDER"],
            ["#F", "#M", "#X"],
            "#X"
        ),
        lastname: Tfw.Transform.upperCase(
            `${record["#PATIENT-LASTNAME"]}`
        ),
        secondname: Tfw.Transform.normalizeName(
            `${record["#PATIENT-SECONDNAME"]}`
        ),
        size: Tfw.Converter.Integer(
            record["#PATIENT-SIZE"]
        )
    }
    return summary
}

function createPatientFromSummary(summary: IPatientSummary): IPatient {
    const id = Guid.create()
    const now = DateUtil.date2seconds(new Date())
    return {
        id,
        admissions: [],
        created: now,
        attachments: [],
        data: {
            id,
            "#PATIENT-LASTNAME": summary.lastname,
            "#PATIENT-FIRSTNAME": summary.firstname,
            "#PATIENT-SECONDNAME": summary.secondname,
            "#PATIENT-BIRTH": DateUtil.date2seconds(summary.birth),
            "#PATIENT-GENDER": summary.gender,
            "#PATIENT-COUNTRY": summary.country,
            "#PATIENT-SIZE": summary.size,
        },
        edited: now,
        exams: [],
        picture: null,
        vaccins: {}
    }
}

function updateConsultation(patient: IPatient, newConsultation: IConsultation): IPatient {
    for (const admission of patient.admissions) {
        for (const consultation of admission.visits) {
            if (consultation.uuid !== newConsultation.uuid) continue
            consultation.version = 1 + Math.max(
                consultation.version, newConsultation.version)
            consultation.enter = newConsultation.enter
            consultation.data = { ...newConsultation.data }
            return patient
        }
    }

    return patient
}

function removeConsultation(patient: IPatient, consultationId: string): IPatient {
    for (const admission of patient.admissions) {
        admission.visits = admission.visits.filter(
            consultation => consultation.uuid !== consultationId
        )
    }
    return patient
}

function getAllConsultationsBefore(patient: IPatient, timeInSeconds: number): IConsultation[] {
    const consultations: IConsultation[] = []
    for (const admission of patient.admissions) {
        for (const consultation of admission.visits) {
            if (consultation.enter < timeInSeconds) {
                consultations.push(consultation)
            }
        }
    }

    // Sort then with the more recent first.
    consultations.sort(
        (c1: IConsultation, c2: IConsultation) => c2.enter - c1.enter
    )

    return consultations
}
