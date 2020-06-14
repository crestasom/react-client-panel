import { compose } from 'redux'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { clearNotify } from '../../actions/notifyActions'
import React, { Component } from 'react'

class Alert extends Component {
    componentDidMount() {
        console.log("componentDidMount")
        const { clearNotify } = this.props
        clearNotify()
    }
    render() {
        console.log("render")
        const { message, messageType } = this.props
        console.log(message, "message")
        return (
            <div className={classnames('alert', {
                'alert-success': messageType === 'success',
                'alert-danger': messageType === 'error',
            })}>
                {message}
            </div>
        );
    }
}


Alert.propTypes = {
    message: PropTypes.string.isRequired,
    messageType: PropTypes.string.isRequired,
    clearNotify: PropTypes.func.isRequired,
};

export default compose(
    connect((state, props) => ({
        notify: state.notify,
        settings: state.settings
    }), { clearNotify })
)(Alert);
