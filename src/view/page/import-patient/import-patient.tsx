import React from "react"
import Tfw from 'tfw'
import State from '../../../state'
import PatientShortDesc from '../../patient-short-desc'
import PatientService from '../../../service/patient'
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
    addedPatientsCount: number
    rejectedPatientsCount: number
}

export default class ImportPatient extends React.Component<IImportPatientProps, IImportPatientState> {
    state = {
        progress: 0,
        count: 0,
        patient: undefined,
        addedPatientsCount: 0,
        rejectedPatientsCount: 0
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

        this.setState(
            { progress: 0.000001 },
            () => this.importPatients(file.path)
        )
    }

    private async importPatients(path: string) {
        const importer = await PatientImportService.create(path)
        let addedPatientsCount = 0
        let rejectedPatientsCount = 0
        this.setState({
            count: importer.patientsCount,
            addedPatientsCount,
            rejectedPatientsCount
        })

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
                if (PatientService.exists(patient.id)) {
                    rejectedPatientsCount++
                    this.setState({ rejectedPatientsCount })
                } else {
                    addedPatientsCount++
                    this.setState({ addedPatientsCount })
                    await PatientService.setPatient(patient)
                }
            } catch (ex) {
                console.error(ex)
            }
        }
        this.setState({ progress: 1 })
    }

    private handleBack = async () => {
        State.setPage("patients")
        const patients = await PatientService.getAllPatients()
        console.info("patients=", patients)
        State.setPatients(patients)
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
                    label="Retour"
                    enabled={!isWorking}
                    color="S"
                    onClick={this.handleBack}
                />
                <p>
                    Utilisez cet outil pour récupérer des patients depuis une autre
                    base de donnée.<br />
                    Seuls les patients que vous n'avez pas déjà dans votre base
                    seront importés.
                </p>
                <InputFile
                    accept=".json"
                    icon="user"
                    label='Importer le fichier "patients.json"'
                    wide={true}
                    enabled={!isWorking && count === 0}
                    onClick={this.handleFilesClick}
                />
            </Flex>
            <div className={`progress ${count > 0 ? "show" : "hide"}`}>
                <Progress
                    label={`Importation de ${count} patient${count > 1 ? "s" : ""} (${Math.floor(0.5 + 100 * progress)}%)`}
                    value={progress}
                    wide={true}
                    height="2rem"
                />
                {
                    patient &&
                    <div className="patient-desc">
                        <PatientShortDesc patient={patient} />
                    </div>
                }
            </div>
            <Flex>
                <div>
                    <p>Patients importés :</p>
                    <big>{this.state.addedPatientsCount}</big>
                </div>
                <div>
                    <p>Patients déjà existants :</p>
                    <big>{this.state.rejectedPatientsCount}</big>
                </div>
            </Flex>
        </div>)
    }
}
