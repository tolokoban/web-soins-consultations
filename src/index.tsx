import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import State from './state'
import Settings from './settings'
import PatientService from './service/patient'
import StructureService from './service/structure'
import * as serviceWorker from './serviceWorker'


async function start() {
    const isInitialized = await Settings.initialize()
    console.info("isInitialized=", isInitialized)
    const patients = await PatientService.getAllPatients()
    console.info("patients=", patients)
    State.setPatients(patients)
    const structure = await StructureService.getFromRemote()
    console.info("structure=", structure)

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    )
}

start()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
