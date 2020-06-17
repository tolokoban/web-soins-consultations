export * from './state/types'

export interface IConsultation {
    /** Seconds since Epoc. */
    enter: number
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
    data: {
        [key: string]: string | number | boolean
    },
    admissions: IAdmission[]
    vaccins: {}
    exams: []
    picture: string | null
    attachments: []
}

export interface IPatientSummary {
    id: string
    lastname: string
    firstname: string
    secondname: string
    gender: string
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
    [key: string]: string
}
