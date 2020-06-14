import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { firebaseConnect } from 'react-redux-firebase'
import { notifyUser, clearNotify } from '../../actions/notifyActions'
import Alert from '../layout/Alert'

import React, { Component } from 'react'

class Register extends Component {
    state = {
        email: "",
        password: ""
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onSubmit = event => {
        event.preventDefault();
        const { firebase, notifyUser } = this.props
        const { email, password } = this.state
        //register with firebase
        firebase.createUser({ email, password }).catch(notifyUser("That User already exists", "error"))
    }
    UNSAFE_componentWillMount() {
        const { allowRegistration } = this.props.settings
        if (!allowRegistration) {
            this.props.history.push("/")
        }
    }


    render() {
        const { message, messageType } = this.props.notify
        return (
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            {message ? (<Alert message={message} messageType={messageType} />) : null}
                            <h1 className="text-center pb-4 pt-3">
                                <span className="text-primary">
                                    <i className="fas fa-lock">
                                        Register
                                    </i>
                                </span>
                            </h1>
                            <form
                                onSubmit={this.onSubmit}>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="text" className="form-control" name="email" required value={this.state.email} onChange={this.onChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" name="password" required value={this.state.password} onChange={this.onChange} />

                                </div>
                                <input type="submit" value="Register" className="btn btn-primary btn-block" />
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
Register.propTypes = {
    firebase: PropTypes.object.isRequired,
    notify: PropTypes.object.isRequired,
    notifyUser: PropTypes.func.isRequired,
    clearNotify: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired
}

export default compose(
    firebaseConnect(),
    connect((state, props) => ({
        notify: state.notify,
        settings: state.settings
    }), { notifyUser, clearNotify })
)(Register)
