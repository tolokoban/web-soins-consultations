import { connect } from 'react-redux'
import { IAppState } from "../types"
import AppView from "./app"

function mapStateToProps(state: IAppState) {
    return {
        page: state.page,
        patient: state.patient,
        patients: state.patients
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
        // onClick: ...
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
