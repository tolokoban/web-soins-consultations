import React from "react"
import Tfw from 'tfw'
import DateUtil from '../../../date-util'
import State from '../../../state'
import Translate from '../../../translate'
import PatientShortDesc from '../../patient-short-desc'
import PatientManager from '../../../manager/patient'
import PatientService from '../../../service/patient'
import ConsultationForm from '../../consultation-form'
import { IPatient, IPatientSummary, IConsultation } from "../../../types"


import "./consultation.css"

const Button = Tfw.View.Button
const InputDate = Tfw.View.InputDate

interface IConsultationsProps {
    className?: string | string[]
    patientSummary: IPatientSummary
    consultationId: string
}
interface IConsultationsState {
    patient?: IPatient
}

export default class Consultations extends React.Component<IConsultationsProps, IConsultationsState> {
    private oldPatientSummary?: IPatientSummary
    state: IConsultationsState = {
        patient: undefined
    }

    private refresh = async () => {
        const { patientSummary } = this.props
        if (patientSummary === this.oldPatientSummary) return
        this.oldPatientSummary = patientSummary
        const patient = await PatientService.getPatient(patientSummary.id)
        this.setState({ patient })
    }

    componentDidMount = this.refresh
    componentDidUpdate = this.refresh

    private handleBack = () => {
        State.setPage("patient")
        State.clearPatient()
    }

    render() {
        const classes = [
            'view-page-Consultation',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const { patient } = this.state
        if (!patient) {
            console.warn("No patient!")
            return null
        }
        const { consultationId } = this.props
        const consultation: IConsultation | null = PatientManager.getConsultationFromUuid(
            patient,
            consultationId
        )
        if (!consultation) {
            console.warn("No consultation!")
            console.info("consultationId=", consultationId)
            return null
        }
        const patientSummary = PatientManager.getSummary(patient)
        const consultationDate = DateUtil.seconds2date(
            consultation.enter
        )

        return (<div className={classes.join(' ')}>
            <header className="thm-bgPD thm-ele-nav">
                <Button
                    label={Translate.back}
                    icon="back"
                    small={true}
                    warning={true}
                    onClick={this.handleBack}
                />
                <div className="date">{
                    DateUtil.formatDate(consultationDate)
                }</div>
                <PatientShortDesc patient={patientSummary} />
            </header>
            <section>
                <InputDate
                    label={Translate.consultationDate}
                    value={consultation.enter * 1000}
                />
                <hr />
                <ConsultationForm
                    patient={patient}
                    consultation={consultation}
                />
            </section>
        </div>)
    }
}
