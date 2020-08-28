import React from "react"
import Tfw from 'tfw'
import State from '../../../state'
import Translate from '../../../translate'
import PatientShortDesc from '../../patient-short-desc'
import PatientService from '../../../service/patient'
import Consultations from './section/consultations'
import Vaccins from './section/vaccins'
import Guid from '../../../guid'
import DateUtil from '../../../date-util'
import {
    IPatientSummary, IPatient, IConsultation, IAdmission, IVaccin
} from "../../../types"


import "./patient.css"

const Button = Tfw.View.Button
const TabStrip = Tfw.Layout.TabStrip

interface IPatientProps {
    className?: string | string[]
    patientSummary: IPatientSummary
}
interface IPatientState {
    patient?: IPatient
}

export default class Patient extends React.Component<IPatientProps, IPatientState> {
    private oldPatientId = ""
    state: IPatientState = {}

    private refresh = async () => {
        const { patientSummary } = this.props
        if (this.oldPatientId === patientSummary.id) return
        this.oldPatientId = patientSummary.id
        const patient = await PatientService.getPatient(patientSummary.id)
        console.info("patient=", patient)
        this.setState({ patient })
    }

    componentDidMount = this.refresh
    componentDidUpdate = this.refresh

    private handleConsultationClick = (consultationId: string) => {
        console.info("consultationId=", consultationId)
        State.setConsultationId(consultationId)
        State.setPage("consultation")
    }

    private handleNewConsultationClick = async () => {
        const { patient } = this.state
        if (!patient) return
        const consultation: IConsultation = {
            enter: DateUtil.date2seconds(new Date()),
            uuid: Guid.create(),
            version: 0,
            data: {}
        }
        if (patient.admissions.length === 0) {
            // No admission yet. Let's create one.
            patient.admissions.push({
                enter: consultation.enter,
                visits: []
            })
        }
        const lastAdmission: IAdmission = patient.admissions[patient.admissions.length - 1]
        lastAdmission.visits.push(consultation)
        await PatientService.setPatient(patient)
        this.setState({
            patient: { ...patient }
        }, () => this.handleConsultationClick(consultation.uuid))
    }

    private handleUpdateVaccin = async (id: string, vaccin: IVaccin) => {
        console.info("handleUpdateVaccin()  ", id, vaccin)
        const { patient } = this.state
        if (!patient) return
        patient.vaccins[id] = vaccin
        console.info("patient=", patient)
        await PatientService.setPatient(patient)
        this.setState({ patient: { ...patient } })
    }

    private handleBack = () => {
        State.setPage("patients")
        State.clearPatient()
    }

    render() {
        const classes = [
            'view-page-Patient',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <header className="thm-bgPD thm-ele-nav">
                <Button
                    label={Translate.back}
                    icon="back"
                    small={true}
                    warning={true}
                    onClick={this.handleBack}
                />
                <PatientShortDesc patient={this.props.patientSummary} />
                <Button
                    label={Translate.editPatient}
                    icon="user"
                    small={true}
                    warning={false}
                    onClick={this.handleBack}
                />
            </header>
            <section>
                <TabStrip
                    headers={[Translate.consultations, Translate.vaccins]}
                >
                    <Consultations
                        patient={this.state.patient}
                        onConsultationClick={this.handleConsultationClick}
                        onNewConsultationClick={this.handleNewConsultationClick}
                    />
                    <Vaccins
                        patient={this.state.patient}
                        onUpdateVaccin={this.handleUpdateVaccin}
                    />
                </TabStrip>
            </section>
        </div>)
    }
}
