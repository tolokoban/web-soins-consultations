import Tfw from 'tfw'
import DateUtil from '../date-util'
import { IPatient, IPatientSummary, IConsultation, IRecord } from '../types'

export default {
    getConsultationFromUuid,
    getSummary,
    getSummaryFromRecord
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

function getSummaryFromRecord(record: IRecord): IPatientSummary {
    const summary: IPatientSummary = {
        id: record.id,
        birth: DateUtil.seconds2date(
            Tfw.Converter.Integer(
                record["#PATIENT-BIRTH"]
            )
        ),
        country: record["#PATIENT-COUNTRY"],
        firstname: Tfw.Util.normalizeFirstname(
            record["#PATIENT-FIRSTNAME"]
        ),
        gender: Tfw.Converter.Enum<string>(
            record["#PATIENT-GENDER"],
            ["#F", "#M", "#X"],
            "#X"
        ),
        lastname: Tfw.Util.normalizeLastname(
            record["#PATIENT-LASTNAME"]
        ),
        secondname: Tfw.Util.normalizeFirstname(
            record["#PATIENT-LASTNAME"]
        ),
        size: Tfw.Converter.Integer(
            record["#PATIENT-SIZE"]
        )
    }
    return summary
}
