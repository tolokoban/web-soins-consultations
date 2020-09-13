import React from "react"
import Tfw from 'tfw'
import JSZip from 'jszip'
import DateUtil from '../../../../../date-util'
import PatientService from '../../../../../service/patient'
import PatientManager from '../../../../../manager/patient'
import { IPatient, IStructure } from "../../../../../types"

import "./prescriptions.css"

const FS = require("fs")
const Path = require("path")

const Checkbox = Tfw.View.Checkbox
const Button = Tfw.View.Button
const Expand = Tfw.View.Expand
const Input = Tfw.View.Input
const Storage = new Tfw.Storage.PrefixedLocalStorage("web-soins-consultations/prescription")

const MONTHES = [
    'Janvier', 'Février', 'Mars', 'Avril',
    'Mai', 'Juin', 'Juillet', 'Août',
    'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

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
            this.setState({ selection: [...selectionWithoutItem, itemKey] })
        } else {
            this.setState({ selection: [...selectionWithoutItem] })
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

    private handlePrint = async () => {
        const { patient } = this.props
        if (!patient) return ""
        const pages: IPages = groupSelectionByPage(this.state.selection)
        console.info("pages=", pages)
        const arch = new JSZip()
        if (!arch) {
            console.error("Unable to create JSZip object!")
            return
        }
        const content = await this.buildContent(pages)
        console.info("content=", content)
        arch.folder("META-INF") ?.file("manifest.xml", await Tfw.Util.loadTextFromURL("META-INF/manifest.xml"))
        arch.file("content.xml", content)
        arch.file("manifest.rdf", await Tfw.Util.loadTextFromURL("manifest.rdf"))
        arch.file("meta.xml", await Tfw.Util.loadTextFromURL("meta.xml"))
        arch.file("mimetype", await Tfw.Util.loadTextFromURL("mimetype"))
        arch.file("settings.xml", await Tfw.Util.loadTextFromURL("settings.xml"))
        arch.file("styles.xml", await Tfw.Util.loadTextFromURL("styles.xml"))
        const now = new Date()
        const filename = Path.resolve(
            PatientService.getPatientFolder(patient.id),
            `pres-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.odt`
        )
        console.info("filename=", filename)
        try {
            const stream = arch.generateNodeStream(
                {
                    type: 'nodebuffer',
                    streamFiles: true,
                    compression: "DEFLATE",
                    compressionOptions: { level: 9 },
                    mimeType: "application/vnd.oasis.opendocument.text"
                },
                (metadata: { percent: number, currentFile: string }) => {
                    console.log(">", metadata.currentFile, metadata.percent)
                }
            )
            console.info("stream=", stream)
            stream.pipe(FS.createWriteStream(filename))
                .on('error', (err: any) => {
                    console.error("ERROR:", err)
                })
                .on('finish', () => {
                    console.log("File has been written to the disk.")
                    Tfw.Factory.Dialog.alert(<div>
                        <p>Le document a été généré avec succès et sauvegardé sur le disque :</p>
                        <code>{filename}</code>
                    </div>)
                    nw.Shell.openItem(filename)
                })
        } catch (ex) {
            console.error("Unable to create Zip archive!")
            console.error(ex)
        }
    }

    async buildContent(pages: IPages): Promise<string> {
        const { patient } = this.props
        if (!patient) return ""
        const summary = PatientManager.getSummary(patient)
        const { service, prescripteur } = this.state

        let out: string = await Tfw.Util.loadTextFromURL("./doc/prescription/content.head.xml")
        for (const page of pages) {
            const [pageTitle, sections] = page
            var today = new Date()
            out += tag("text:p", { "text:style-name": "P18" }, pageTitle)
            out += tag('text:p', { 'text:style-name': 'P2' },
                tag('text:span', { 'text:style-name': 'T5' }, "Nom du patient : "),
                tag('text:span', { 'text:style-name': 'T3' }, summary.lastname),
                tag('text:span', { 'text:style-name': 'T6' }, tag('text:tab')),
                tag('text:span', { 'text:style-name': 'T5' }, "Prénom : "),
                tag('text:span', { 'text:style-name': 'T3' }, summary.firstname));
            out += tag('text:p', { 'text:style-name': 'P1' },
                tag('text:span', { 'text:style-name': 'T5' }, "Date de naissance : "),
                tag('text:span', { 'text:style-name': 'T3' }, DateUtil.formatDate(summary.birth)))
            out += tag('text:p', { 'text:style-name': 'P4' })
            out += tag('text:p', { 'text:style-name': 'P15' },
                tag('text:span', { 'text:style-name': 'T5' },
                    "Date de demande de l'examen : ",
                    tag('text:span', { 'text:style-name': 'T3' },
                        today.getDate() + " "
                        + MONTHES[today.getMonth()] + " "
                        + today.getFullYear())));
            out += tag('text:p', { 'text:style-name': 'P15' },
                tag('text:span', { 'text:style-name': 'T5' },
                    `Nom du prescripteur : ${prescripteur}`,
                    tag('text:tab')));
            out += tag('text:p', { 'text:style-name': 'P15' },
                tag('text:span', { 'text:style-name': 'T5' },
                    `Nom du service prescripteur de l'examen : ${service}`,
                    tag('text:tab')));
            out += tag('text:p', { 'text:style-name': "Heading_20_2" })
            for (const section of sections) {
                const [sectionTitle, exams] = section
                out += tag("text:p", { "text:style-name": "Heading_20_2" }, sectionTitle)
                for (const exam of exams) {
                    out += tag('text:list', { 'text:style-name': 'L1' },
                        tag('text:list-item',
                            tag('text:p', { 'text:style-name': 'P16' },
                                `${exam} : ${tag('text:tab')}`)))
                }
            }
        }

        return `${out}${Tfw.Util.loadTextFromURL('./doc/prescription/content.foot.xml')}`
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


type ISection = [string, string[]]
type IPage = [string, ISection[]]
type IPages = IPage[]


function groupSelectionByPage(selection: string[]): IPages {
    const pages: IPages = []
    const sortedSelection = [...selection].sort()

    for (const key of sortedSelection) {
        const [pageName, sectionName, examName] = key.split("\n")
        const page = getPageElement(pages, pageName)
        const [, sections] = page
        const section = getSectionElement(sections, sectionName)
        const [, exams] = section
        exams.push(examName)
    }

    return pages
}


function getPageElement(pages: IPages, pageName: string): IPage {
    for (const page of pages) {
        const [currentPageName] = page
        if (currentPageName === pageName) return page
    }
    const newPage: IPage = [pageName, []]
    pages.push(newPage)
    return newPage
}

function getSectionElement(sections: ISection[], sectionName: string): ISection {
    for (const section of sections) {
        const [currentSectionName] = section
        if (currentSectionName === sectionName) return section
    }
    const newSection: ISection = [sectionName, []]
    sections.push(newSection)
    return newSection
}


interface IAttributes { [key: string]: string }

function tag(name: string, ...args: Array<string | IAttributes>) {
    if (args.length === 0) return "<" + name + "/>"
    if (args.length === 0 && typeof args[0] === 'string') return `<${name}>${args[0]}</${name}>`

    let out = `<${name}`
    let attribs: IAttributes = {}
    let content = ''
    for (const arg of args) {
        if (typeof arg === 'string') content += arg
        else attribs = arg
    }

    for (const key of Object.keys(attribs)) {
        const val = attribs[key]
        out += ` ${key}=${JSON.stringify(val)}`
    }
    if (content.length > 0) {
        out += `>${content}</${name}>`
    } else {
        out += "/>"
    }

    return out
}
