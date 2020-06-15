import { connect } from 'react-redux'
import { IAppState } from "../types"
import AppView from "./App"

function mapStateToProps(state: IAppState) {
    return { page: state.page };
}

function mapDispatchToProps(dispatch: any) {
    return {
        // onClick: ...
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
