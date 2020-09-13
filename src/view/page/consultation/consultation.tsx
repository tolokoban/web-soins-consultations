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
    // If null consultation is given, that is a cancel opération.
    onBack(consultation: IConsultation | null, patient?: IPatient): void
}
interface IConsultationsState {
    patient?: IPatient
    consultation: IConsultation | null
}

export default class Consultations extends React.Component<IConsultationsProps, IConsultationsState> {
    private oldPatientSummary?: IPatientSummary
    private oldConsultationId?: string
    state: IConsultationsState = {
        patient: undefined,
        consultation: null
    }

    private refresh = async () => {
        const { patientSummary } = this.props
        if (patientSummary !== this.oldPatientSummary) {
            this.oldPatientSummary = patientSummary
            const patient = await PatientService.getPatient(patientSummary.id)
            this.setState({ patient })
        }
        const { consultationId } = this.props
        const { patient } = this.state
        if (patient && consultationId !== this.oldConsultationId) {
            this.oldConsultationId = consultationId
            const consultation: IConsultation | null = copy(
                PatientManager.getConsultationFromUuid(
                    patient,
                    consultationId
                )
            )
            this.setState({ consultation })
        }
    }

    componentDidMount = this.refresh
    componentDidUpdate = this.refresh

    private handleOK = () => {
        this.props.onBack(this.state.consultation, this.state.patient)
    }

    private handleCancel = () => {
        this.props.onBack(null)
    }

    private handleDataChange = (time: number) => {
        const { consultation } = this.state
        if (consultation ) {
            consultation.enter = Math.floor(time / 1000)
        }
    }

    render() {
        const classes = [
            'view-page-Consultation',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const { patient, consultation } = this.state
        if (!patient) return null
        if (!consultation) return null
        const patientSummary = PatientManager.getSummary(patient)
        const consultationDate = DateUtil.seconds2date(
            consultation.enter
        )

        return (<div className={classes.join(' ')}>
            <header className="thm-bgPD thm-ele-nav">
                <div>
                    <Button
                        label={Translate.ok}
                        icon="ok"
                        small={true}
                        color="S"
                        onClick={this.handleOK}
                    />
                    <Button
                        label={Translate.cancel}
                        icon="cancel"
                        color="S"
                        small={true}
                        flat={true}
                        onClick={this.handleCancel}
                    />
                </div>
                <div className="date">{
                    DateUtil.formatDate(consultationDate)
                }</div>
                <PatientShortDesc patient={patientSummary} />
            </header>
            <section>
                <InputDate
                    label={Translate.consultationDate}
                    value={consultation.enter * 1000}
                    onChange={this.handleDataChange}
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


function copy(obj: IConsultation | null) {
    if (!obj) return obj
    return JSON.parse(JSON.stringify(obj))
}
