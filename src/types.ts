export * from './state/types'

export interface IConsultation {
    /** Seconds since Epoc. */
    enter: number
    /**
     * Everytime you edit the values of a consultation,
     * you must increment the "version".
     */
    version: number
    uuid: string
    data: {
        [key: string]: string
    }
}

export interface IAdmission {
    /** Seconds since Epoc. */
    enter: number
    visits: IConsultation[]
}

export interface IPatient {
    id: string
    /** Seconds since Epoc. */
    created: number
    /** Seconds since Epoc. */
    edited: number
    data: IRecord,
    admissions: IAdmission[]
    vaccins: IVaccins
    exams: []
    picture: string | null
    attachments: []
}

export interface IVaccins {
    [key: string]: IVaccin
}

export interface IVaccin {
    caption: string
    lot?: string
    date?: number
}

export interface IPatientSummary {
    id: string
    lastname: string
    firstname: string
    secondname: string
    gender: string
    country: string
    birth: Date
    size: number
}

export interface IPatientField {
    id: string
    type: string
    caption: { [key: string]: string }
}

export interface IFormFields {
    [key: string]: IFormField
}

export interface IFormField {
    id: string
    type?: string
    caption: string
    tags: string[]
    children: IFormFields
}

export interface IType {
    id: string
    caption?: string
    children: ITypes
}

export interface ITypes {
    [key: string]: IType
}

export interface IStructure {
    id: number
    organizationId: number
    name: string
    patientFields: IPatientField[]
    formFields: {
        [key: string]: { caption: string, type: string }
    }
    forms: {
        [key: string]: IFormField
    },
    types: ITypes,
    vaccins: IVaccins,
    sources: {
        exams: string
        vaccins: string
        patient: string
        forms: string
        types: string
    }
}

export interface IRecord {
    id: string,
    [key: string]: string | number
}
