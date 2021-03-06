import Tfw from 'tfw'

const _ = Tfw.Intl.make(require("./translate.json"))

export default {
    get addPatient() { return _('add-patient') },
    get back() { return _('back') },
    get birthday() { return _('birthday') },
    get cancel() { return _('cancel') },
    get clickToEdit() { return _('click-to-edit')},
    get close() { return _('close') },
    get code() { return _('code') },
    get confirmDeletePatient() { return _('confirm-patient-delete') },
    get consultationDate() { return _('consultation-date') },
    get consultation() { return _('consultation') },
    get consultations() { return _('consultations') },
    get consultationsCount() { return _('consultations-count') },
    get country() { return _('country') },
    get dateMin() { return _('date-min') },
    get dateMax() { return _('date-max') },
    get deletePatient() { return _('delete-patient') },
    get editPatient() { return _('edit-patient') },
    get executeQuery() { return _('execute-query') },
    get extractions() { return _('extractions') },
    get filter() { return _('filter') },
    get firstName() { return _('firstname') },
    get gender() { return _('gender') },
    genderValue(type: string) {
        switch (type.trim().toUpperCase()) {
            case 'M': return _('gender-male')
            case 'F': return _('gender-female')
            default: return _('gender-undefined')
        }
    },
    get identifier() { return _('identifier') },
    get importPatients() { return _('import-patients') },
    get lastName() { return _('lastname') },
    get loading() { return _('loading') },
    get logout() { return _('logout') },
    get newConsultation() { return _('new-consultation') },
    get ok() { return _('ok') },
    get patients() { return _('patients') },
    get patientsCount() { return _('patients-count') },
    get prescriptions() { return _('prescriptions') },
    get secondName() { return _('secondname') },
    get size() { return _('size') },
    get struct() { return _('struct') },
    get vaccinDate() { return _('vaccin-date') },
    get vaccinLot() { return _('vaccin-lot') },
    get vaccins() { return _('vaccins') },
    get warningConsultationDate() { return _('warning-consultation-date') },
}
