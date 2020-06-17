import React from "react"
import Tfw from 'tfw'
import State from '../../../state'
import PatientShortDesc from '../../patient-short-desc'
import PatientImportService from '../../../service/patient-import'
import { IPatientSummary } from "../../../types"


import "./import-patient.css"

const Button = Tfw.View.Button
const InputFile = Tfw.View.InputFile
const Progress = Tfw.View.Progress
const Flex = Tfw.Layout.Flex
const Dialog = Tfw.Factory.Dialog

interface IImportPatientProps {
    className?: string | string[]
}
interface IImportPatientState {
    progress: number
    count: number
    patient?: IPatientSummary
}

export default class ImportPatient extends React.Component<IImportPatientProps, IImportPatientState> {
    state = {
        progress: 0,
        count: 0,
        patient: undefined
    }

    private handleFilesClick = async (files: FileList) => {
        if (files.length !== 1) {
            await Dialog.error("Veuillez sélectionner un et un seul fichier.")
            return
        }

        // We untype this because we have the `path` attribute
        // thanks to NodeWebkit.
        const file = (files.item(0) as unknown) as any
        if (!file) return
        console.info("file=", file)
        if (file.name !== 'patients.json') {
            await Dialog.error('Vous devez sélectionner un fichier nommé "patients.json".')
            return
        }

        this.setState({ progress: 0.000001 }, () => this.importPatients(file.path))
    }

    private async importPatients(path: string) {
        const importer = await PatientImportService.create(path)
        this.setState({ count: importer.patientsCount })

        for (let patientIndex = 0; patientIndex < importer.patientsCount; patientIndex++) {
            this.setState({
                progress: patientIndex / importer.patientsCount
            })
            try {
                const patientBio = importer.getPatientBio(patientIndex)
                this.setState({ patient: patientBio })
                console.info("patientBio=", patientBio)
                const key = patientBio.id
                const patient = await importer.getPatient(key)
                console.info("patient=", patient)
            } catch (ex) {
                console.error(ex)
            }
        }
        this.setState({ progress: 1 })
    }

    render() {
        const classes = [
            'view-page-ImportPatient', 'thm-bg1',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const { progress, count, patient } = this.state
        const isWorking = progress > 0 && progress < 1

        return (<div className={classes.join(' ')}>
            <Flex>
                <Button
                    className="back-button"
                    icon="left"
                    enabled={!isWorking}
                    warning={true}
                    onClick={() => State.setPage("patients")}
                />
                <InputFile
                    accept=".json"
                    icon="user"
                    label='Veuillez sélectionner le fichier "patients.json"'
                    wide={true}
                    enabled={!isWorking}
                    onClick={this.handleFilesClick}
                />
            </Flex>
            <div className="progress">
                {
                    count > 0 &&
                    <Progress
                        label={`Importation de ${count} patient${count > 1 ? "s" : ""}`}
                        value={progress}
                        wide={true}
                        height="2rem"
                    />
                }
                {
                    patient &&
                    <PatientShortDesc patient={patient}/>
                }
            </div>
        </div>)
    }
}
