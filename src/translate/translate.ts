import Tfw from 'tfw'

const _ = Tfw.Intl.make(require("./translate.json"))

export default {
    get back() { return _('back') },
    get birthday() { return _('birthday') },
    get cancel() { return _('cancel') },
    get close() { return _('close') },
    get code() { return _('code') },
    get consultationDate() { return _('consultation-date') },
    get consultations() { return _('consultations') },
    get consultationsCount() { return _('consultations-count') },
    get country() { return _('country') },
    get dateMin() { return _('date-min') },
    get dateMax() { return _('date-max') },
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
    get secondName() { return _('secondname') },
    get size() { return _('size') },
    get struct() { return _('struct') },
    get vaccins() { return _('vaccins') }
}
