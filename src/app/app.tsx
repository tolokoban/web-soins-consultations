import React from "react"
import Tfw from 'tfw'

import Splash from './splash'
import PagePatients from '../view/page/patients'
import PageImportPatients from '../view/page/import-patient'
import { IPatientSummary } from '../types'

import "./app.css"

const Button = Tfw.View.Button
const Stack = Tfw.Layout.Stack

interface IAppProps {
    className?: string[]
    page: string
    patient: IPatientSummary
    patients: IPatientSummary[]
}
interface IAppState { }

export default class App extends React.Component<IAppProps, IAppState> {
    state = {}

    async componentDidMount() {
        Splash.hide()
    }

    render() {
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
                <PagePatients
                    key="patients"
                    patient={this.props.patient}
                    patients={this.props.patients}
                />
                <PageImportPatients
                    key="import-patients"
                />
            </Stack>
        </div>)
    }
}
