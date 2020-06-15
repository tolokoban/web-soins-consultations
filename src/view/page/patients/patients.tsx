import React from "react"
import Tfw from 'tfw'

//import { * } from "../../../types"


import "./patients.css"

const Button = Tfw.View.Button
const _ = Tfw.Intl.make(require("./patients.yaml"))

interface IPatientsProps {
    className?: string[]
}
interface IPatientsState {}

export default class Patients extends React.Component<IPatientsProps, IPatientsState> {
    state = {}

    render() {
        const classes = [
            'view-page-Patients',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <Button label={_('ok')} />
        </div>)
    }
}
