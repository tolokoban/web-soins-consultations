import React from "react"
import Tfw from 'tfw'
import Translate from '../../translate'
import DateUtil from '../../date-util'
import TextField from '../field/text'
import { IPatientSummary } from "../../types"

import "./patient-form.css"

const Input = Tfw.View.Input
const InputDate = Tfw.View.InputDate
const InputInteger = Tfw.View.InputInteger

interface IPatientFormProps {
    className?: string | string[]
    patient: IPatientSummary
    onChange(patient: IPatientSummary): void

}
interface IPatientFormState extends IPatientSummary { }

export default class PatientForm extends React.Component<IPatientFormProps, IPatientFormState> {
    state = {
        id: "",
        lastname: "",
        firstname: "",
        secondname: "",
        gender: "",
        size: 0,
        country: "",
        birth: DateUtil.createUndefinedDate()
    }

    private fireChange = () => {

    }

    private handleLastnameChange = (lastname: string) => {
        this.setState({ lastname }, this.fireChange)
    }

    private handleFirstnameChange = (firstname: string) => {
        this.setState({ firstname }, this.fireChange)
    }

    private handleSecondnameChange = (secondname: string) => {
        this.setState({ secondname }, this.fireChange)
    }

    private handleSizeChange = (size: number) => {
        this.setState({ size }, this.fireChange)
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
            <Input
                label={Translate.lastName}
                transform={Tfw.Util.normalizeLastname}
                wide={true}
                value={lastname}
                onChange={this.handleLastnameChange}
            />
            <Input
                label={Translate.firstName}
                transform={Tfw.Util.normalizeFirstname}
                wide={true}
                value={firstname}
                onChange={this.handleFirstnameChange}
            />
            <Input
                label={Translate.secondName}
                transform={Tfw.Util.normalizeFirstname}
                wide={true}
                value={secondname}
                onChange={this.handleSecondnameChange}
            />
            <TextField
                label={Translate.gender}
                wide={true}
                type="#GENDER"
                value={gender}
                onChange={gender => this.setState({ gender })}
            />
            <InputDate
                label={Translate.birthday}
                value={birth.getTime()}
                onChange={time => this.setState({ birth: new Date(time) })}
            />
            <TextField
                label={Translate.country}
                wide={true}
                type="#COUNTRY"
                value={""}
                onChange={country => { console.info("country=", country) }}
            />
            <InputInteger
                label={Translate.size}
                value={size}
                onChange={this.handleSizeChange}
            />
        </div>)
    }
}