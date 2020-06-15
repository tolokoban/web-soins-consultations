import React from "react"
import Tfw from 'tfw'

// import { ... } from "../../types"

import "./patient-form.css"

const Combo = Tfw.View.Combo
const Input = Tfw.View.Input
const InputInteger = Tfw.View.InputInteger
const Flex = Tfw.Layout.Flex

const _ = Tfw.Intl.make(require("./patient-form.json"))

interface IPatientFormProps {
    className?: string | string[]
    lastname?: string
    firstname?: string
    secondname?: string
    gender?: string
    birth?: Date
    size?: number
}
interface IPatientFormState {
    lastname: string
    firstname: string
    secondname: string
    gender: string
    birth?: Date
    size: number
}

export default class PatientForm extends React.Component<IPatientFormProps, IPatientFormState> {
    state = {
        lastname: "",
        firstname: "",
        secondname: "",
        gender: "",
        size: 0,
        birth: undefined
    }

    private handleLastnameChange = (lastname: string) => {
        this.setState({ lastname })
    }

    private handleFirstnameChange = (firstname: string) => {
        this.setState({ firstname })
    }

    private handleSecondnameChange = (secondname: string) => {
        this.setState({ secondname })
    }

    render() {
        const classes = [
            'view-PatientForm',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const {
            lastname, firstname, secondname,
            gender, birth, size
        } = this.state

        return (<div className={classes.join(' ')}>
            <Flex>
            <Input
                label={_('lastname')}
                wide={true}
                value={lastname}
                onChange={this.handleLastnameChange}
            />
            <Input
                label={_('firstname')}
                wide={true}
                value={firstname}
                onChange={this.handleFirstnameChange}
            />
            <Input
                label={_('secondname')}
                wide={true}
                value={secondname}
                onChange={this.handleSecondnameChange}
            />
            </Flex>
        </div>)
    }
}
