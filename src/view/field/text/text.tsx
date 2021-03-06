import React from "react"
import Tfw from 'tfw'
import StructureManager from '../../../manager/structure'
import Settings from '../../../settings'
import { IStructure } from "../../../types"


import "./text.css"

const Input = Tfw.View.Input

interface ITextProps {
    className?: string | string[]
    label?: string
    wide?: boolean
    type: string
    width?: string
    value: string
    onChange(value: string): void
}
interface ITextState { }

export default class Text extends React.Component<ITextProps, ITextState> {
    state = {}

    private handleChange = (value: string) => {
        const structure = Settings.structure
        if (!structure) return null
        this.props.onChange(getTypeKey(structure, this.props.type, value))
    }

    render() {
        const classes = [
            'view-field-Text',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const structure = Settings.structure
        if (!structure) return null

        const type = this.props.type
        const value = this.props.value
        const suggestions = getSuggestionsForType(structure, type)
console.log("<Text>.render()")
        return <Input
            className={classes.join(" ")}
            label={this.props.label}
            wide={this.props.wide}
            width={this.props.width}
            value={StructureManager.getValueCaption(type ,value)}
            suggestions={suggestions}
            onChange={this.handleChange}
        />
    }
}


function getSuggestionsForType(structure: IStructure, typeName: string): string[] {
    const types = structure.types
    const type = types[typeName]
    if (!type) return []
    const subTypes = Object.values(type.children)
    return subTypes
        .map(t => t.caption)
        .filter(t => typeof t === "string") as string[]
}


function getTypeKey(
    structure: IStructure,
    typeName: string,
    value: string
): string {
    const types = structure.types
    const type = types[typeName]
    if (!type) return value
    const normalizedValue = value.trim().toLowerCase()
    for (const subType of Object.values(type.children)) {
        const caption = subType.caption
        if (!caption) continue
        if (caption.toLowerCase() === normalizedValue) {
            return subType.id
        }
    }
    return value
}
