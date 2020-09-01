import React from "react"
import Tfw from 'tfw'
import Settings from '../../settings'
import DateUtil from '../../date-util'
import { IPatientSummary } from "../../types"


import "./patient-short-desc.css"

interface IPatientShortDescProps {
    className?: string | string[]
    patient?: IPatientSummary
}
interface IPatientShortDescState { }

export default class PatientShortDesc extends React.Component<IPatientShortDescProps, IPatientShortDescState> {
    state = {}

    render() {
        const classes = [
            'view-PatientShortDesc',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const { patient } = this.props
        if (!patient) return null
        const structure = Settings.structure
        if (!structure) return null
        const today = new Date()
        const age = 1 + today.getFullYear() - patient.birth.getFullYear()

        return (
            <div
                className={classes.join(' ')}
                title={patient.id}
            >
                <span className="lastname">{patient.lastname.toUpperCase()}</span>
                <span className="firstname">{patient.firstname}</span>
                {
                    hasSecondName(patient) &&
                    <span className="secondname">{patient.secondname}</span>
                }
                {
                    DateUtil.isDefinedDate(patient.birth) &&
                    <span className="age">{age} <em>ans</em></span>
                }
                {
                    patient.size > 0 &&
                    <span className="size">{patient.size} <em>cm</em></span>
                }
            </div>
        )
    }
}


function hasSecondName(patient: IPatientSummary): boolean {
    const { secondname } = patient
    if (typeof secondname !== 'string') return false
    if (secondname.trim().length === 0) return false
    if (secondname.trim().toLowerCase() === 'undefined') return false
    return true
}
