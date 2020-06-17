import Tfw from 'tfw'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './app'
import State from './state'
import Settings from './settings'
import PatientService from './service/patient'
import StructureService from './service/structure'
import * as serviceWorker from './serviceWorker'

Tfw.Theme.register("soin", {
    white: "#fda", black: "#420",
    bg0: "#ffcb97", bg1: "#ffdab3", bg2: "#ffe6cc", bg3: "#fff3e6",
    bgP: "#742", bgPL: "#953", bgPD: "#531",
    bgS: "#ff9f30", bgSD: "#ff7f00", bgSL: "#ffbf60"
})
Tfw.Theme.apply("soin")
Tfw.Font.loadJosefin()

async function start() {
    const isInitialized = await Settings.initialize()
    const patients = await PatientService.getAllPatients()
    State.setPatients(patients)
    const structure = await StructureService.getFromRemote()
    Settings.structure = structure || undefined

    ReactDOM.render(
        <Provider store={State.store}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </Provider>,
        document.getElementById('root')
    )
}

start()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
