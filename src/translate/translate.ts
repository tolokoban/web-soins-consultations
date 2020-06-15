import Tfw from 'tfw'

const _ = Tfw.Intl.make(require("./translate.json"))

class Dict {
    get cancel() { return _('cancel') }
    get close() { return _('close') }
    get code() { return _('code') }
    get consultations() { return _('consultations') }
    get consultationsCount() { return _('consultations-count') }
    get dateMin() { return _('date-min') }
    get dateMax() { return _('date-max') }
    get executeQuery() { return _('execute-query') }
    get extractions() { return _('extractions') }
    get filter() { return _('filter') }
    get firstName() { return _('firstname') }
    get gender() { return _('gender') }
    genderValue(type: string) {
        switch (type.trim().toUpperCase()) {
            case 'M': return _('gender-male')
            case 'F': return _('gender-female')
            default: return _('gender-undefined')
        }
    }
    get identifier() { return _('identifier') }
    get lastName() { return _('lastname') }
    get loading() { return _('loading') }
    get logout() { return _('logout') }
    get patients() { return _('patients') }
    get patientsCount() { return _('patients-count') }
    get secondName() { return _('secondname') }
    get size() { return _('size') }
    get struct() { return _('struct') }
}

export default new Dict()
