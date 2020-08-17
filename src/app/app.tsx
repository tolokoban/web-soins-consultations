import React from "react"
import Tfw from 'tfw'

import Splash from './splash'
import PageConsultation from '../view/page/consultation'
import PagePatient from '../view/page/patient'
import PagePatients from '../view/page/patients'
import PageImportPatients from '../view/page/import-patient'
import { IPatientSummary, IPatient, IConsultation } from '../types'

import "./app.css"

const Stack = Tfw.Layout.Stack

interface IAppProps {
    className?: string[]
    page: string
    consultationId: string
    patient: IPatientSummary
    patients: IPatientSummary[]
    onPatientChange(patientSummary: IPatientSummary): void
    onPatientClick(patientSummary: IPatientSummary): void
    onEndOfConsultationEdition(consultation: IConsultation | null, patient?: IPatient): void
}
interface IAppState { }

export default class App extends React.Component<IAppProps, IAppState> {
    state = {}

    componentDidMount() {
        Splash.hide()
    }

    handlePatientChange = (patientSummary: IPatientSummary) => {
        this.props.onPatientChange(patientSummary)
    }

    handlePatientClick = (patientSummary: IPatientSummary) => {
        this.props.onPatientClick(patientSummary)
    }

    handleEndOfConsultationEdition = (consultation: IConsultation | null, patient?: IPatient) => {
        this.props.onEndOfConsultationEdition(consultation, patient)
    }

    render() {
        console.log("APP")
        const classes = [
            'App', "thm-bg0",
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <Stack
                fullscreen={true}
                scrollable={true}
                value={this.props.page}
            >
                <PageConsultation
                    key="consultation"
                    consultationId={this.props.consultationId}
                    patientSummary={this.props.patient}
                    onBack={this.handleEndOfConsultationEdition}
                />
                <PagePatient
                    key="patient"
                    patientSummary={this.props.patient}
                />
                <PagePatients
                    key="patients"
                    patient={this.props.patient}
                    patients={this.props.patients}
                    onPatientChange={this.handlePatientChange}
                    onPatientClick={this.handlePatientClick}
                />
                <PageImportPatients
                    key="import-patients"
                />
            </Stack>
        </div>)
    }
}
