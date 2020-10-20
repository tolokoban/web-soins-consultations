import { connect } from 'react-redux'
import ConsoleView, { IConsoleViewProps } from './console-view'
import { IAppState } from '../../types'

function mapStateToProps(state: IAppState): IConsoleViewProps {
    return { logs: state.logs }
}

function mapDispatchToProps(dispatch: (action: any) => void) {
    // @see https://redux.js.org/basics/usage-with-react/#implementing-container-components
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsoleView)
