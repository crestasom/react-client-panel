import { compose } from 'redux'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { clearNotify } from '../../actions/notifyActions'
import React, { Component } from 'react'
import FlashMessage from 'react-flash-message'

class Alert extends Component {

    render() {
        const { message, messageType } = this.props
        return (
            <FlashMessage duration={5000}>
                <div className={classnames('alert', {
                    'alert-success': messageType === 'success',
                    'alert-danger': messageType === 'error',
                })}>
                    {message}
                </div>
            </FlashMessage>
        );
    }
    componentWillUnmount() {
        console.log("componentWillUnmount")
        this.props.clearNotify()
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
