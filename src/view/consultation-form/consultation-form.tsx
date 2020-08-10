import React from "react"
import Tfw from 'tfw'
import Settings from '../../settings'
import TextField from '../field/text'
import { IPatient, IFormField, IFormFields, IConsultation } from "../../types"


import "./consultation-form.css"

const Expand = Tfw.View.Expand
const Checkbox = Tfw.View.Checkbox

interface IConsultationFormProps {
    className?: string | string[]
    patient: IPatient
    consultation: IConsultation
}
interface IConsultationFormState { }

export default class ConsultationForm extends React.Component<IConsultationFormProps, IConsultationFormState> {
    state = {}

    private getFieldValue(field: IFormField): string {
        const { consultation } = this.props
        if (!consultation) return ""
        const { data } = consultation
        if (!data) return ""
        return data[field.id] || ""
    }

    private getFieldValueAsBoolean(field: IFormField): boolean {
        const value = this.getFieldValue(field)
        return Tfw.Converter.Enum<string>(
            value,
            ["#YES", "#TRUE"],
            "#FALSE"
        ) !== "#FALSE"
    }

    private renderFields(fields: IFormFields) {
        return Object.keys(fields).map(
            name => {
                const field = fields[name]
                if (!field) return null
                return this.renderField(field)
            }
        )
    }

    private renderField(field: IFormField) {
        if (hasChildren(field)) {
            return <Expand
                key={field.id}
                label={field.caption}
                value={false}
                className="thm-ele-button"
            >
                {this.renderFields(field.children)}
            </Expand>
        }

        const { consultation } = this.props
        if (isBool(field)) {
            return <Checkbox
                key={field.id}
                label={field.caption}
                value={this.getFieldValueAsBoolean(field)}
                type={field.type || ""}
                width="12rem"
                onChange={(value: string) => this.updateField(field, value)}
            />
        }

        console.info("field=", field, consultation)
        return <TextField
            key={field.id}
            label={field.caption}
            value={this.getFieldValue(field)}
            type={field.type || ""}
            width="12rem"
            onChange={(value: string) => this.updateField(field, value)}
        >
        </TextField>
    }

    private updateField = (field: IFormField, value: string) => {
        const sanitizedValue = (value || "").trim()
        const { consultation } = this.props
        delete consultation.data[field.id]
        if (sanitizedValue.length > 0) {
            consultation.data[field.id] = sanitizedValue
        }
    }

    render() {
        const classes = [
            'view-ConsultationForm',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const structure = Settings.structure
        if (!structure) return null
        const form = structure.forms

        return (<div className={classes.join(' ')}>
            {this.renderFields(form)}
        </div>)
    }
}


/**
 * If a field has children, it will be represented by an expander.
 */
function hasChildren(field: IFormField): boolean {
    if (!field.children) return false
    const names = Object.keys(field.children)
    return names.length > 0
}


function isBool(field: IFormField): boolean {
    const { tags } = field
    if (!Array.isArray(tags)) return false
    for (const tag of tags) {
        if (tag.trim().toUpperCase() === "BOOL") return true
    }
    return false
}
