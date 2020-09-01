import React from "react"
import Tfw from 'tfw'

import { IPatient, IStructure } from "../../../../../types"

import "./prescriptions.css"

const Button = Tfw.View.Button
const Checkbox = Tfw.View.Checkbox
const Expand = Tfw.View.Expand
const Input = Tfw.View.Input
const Storage = new Tfw.Storage.PrefixedLocalStorage("web-soins-consultations/prescription")

interface IPrescriptionsProps {
    className?: string
    patient?: IPatient
    structure?: IStructure
}
interface IPrescriptionsState {
    prescripteur: string
    service: string
    selection: string[]
}

export default class Prescriptions extends React.Component<IPrescriptionsProps, IPrescriptionsState> {
    state: IPrescriptionsState = {
        ...Storage.get("state", {
            prescripteur: "",
            service: ""
        }),
        selection: []
    }

    private update = (newState: Partial<IPrescriptionsState>) => {
        const state = {
            ...this.state,
            ...newState
        }
        this.setState(state)
        Storage.set("state", state)
    }

    private setItemSelection(itemKey: string, selected: boolean) {
        const { selection } = this.state
        const selectionWithoutItem = selection.filter((key: string) => key !== itemKey)
        if (selected) {
            this.setState({ selection: [...selectionWithoutItem, itemKey]})
        } else {
            this.setState({ selection: [...selectionWithoutItem]})
        }
    }

    private renderSections(exams: { [key: string]: { [key: string]: string[] } }) {
        return Object.keys(exams).map(
            (sectionKey: string) => this.renderSection(
                sectionKey,
                exams[sectionKey]
            )
        )
    }

    private renderSection(sectionKey: string, section: { [key: string]: string[] }) {
        const subSectionElements = Object.keys(section).map(
            (subSectionKey: string) => {
                const subSection = section[subSectionKey]
                return <Expand
                    key={`${sectionKey}\n${subSectionKey}`}
                    label={subSectionKey}
                    value={false}
                >{
                    subSection.map((label: string) => this.renderCheckbox(
                        sectionKey,
                        subSectionKey,
                        label
                    ))
                }</Expand>
            }
        )
        return [
            <h1 key="sectionKey">{sectionKey}</h1>,
            ...subSectionElements
        ]
    }

    private renderCheckbox(sectionKey: string, subSectionKey: string, label: string) {
        const key = `${sectionKey}\n${subSectionKey}\n${label}`
        const isSelected = this.state.selection.indexOf(key) !== -1
        return <Checkbox
            label={label}
            wide={true}
            value={isSelected}
            onChange={(value: boolean) => this.setItemSelection(key, value)}
        />
    }

    private handlePrint = () => {
        const pages: IPages = groupSelectionByPage(this.state.selection)
        console.info("pages=", pages)
    }

    render() {
        const { patient, structure } = this.props
        if (!patient || !structure) return null

        const classes = [
            'view-page-patient-section-Prescriptions',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <fieldset>
                <legend className="thm-fgPL">Liste des examens à prescrire</legend>
                {
                    this.renderSections(structure.exams)
                }
            </fieldset>
            <Input
                label="Nom du prescripteur"
                wide={true}
                value={this.state.prescripteur}
                onChange={prescripteur => this.update({ prescripteur })}
            />
            <Input
                label="Nom du service prescripteur de l'examen"
                wide={true}
                value={this.state.service}
                onChange={service => this.update({ service })}
            />
            <Button
                icon="print"
                label="Préparer le document pour impression"
                onClick={this.handlePrint}
            />
        </div>)
    }
}


type IPage = [string, string[]]
type IPages = IPage[]


function groupSelectionByPage(selection: string[]): IPages {
    const pages: IPages = []
    const sortedSelection = [...selection].sort()

    for (const key of sortedSelection) {
        const [page, , exam] = key.split("\n")
        const [, exams]: [string, string[]] = getPageElement(pages, page)
        exams.push(exam)
    }

    return pages
}


function getPageElement(pages: IPages, page: string): IPage {
    for (const element of pages) {
        const [elementPageName] = element
        if (elementPageName === page) return element
    }
    const newElement: IPage = [page, []]
    pages.push(newElement)
    return newElement
}
