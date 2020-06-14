import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import classnames from 'classnames'
class ClientDetails extends Component {

    state = {
        showbalanceUpdate: false,
        balanceUpdateAmount: ''
    }

    // componentDidMount() {
    //     this.setState({
    //         balanceUpdateAmount: this.props.client.balance
    //     })
    // }
    onchange = (e) => this.setState({ [e.target.name]: e.target.value })
    balanceSubmit = (e) => {
        e.preventDefault();
        const { client, firestore } = this.props
        const { balanceUpdateAmount } = this.state
        const clientUpdate = {
            balance: parseFloat(balanceUpdateAmount)
        }
        //update in firestore
        firestore.update({ collection: "clients", doc: client.id }, clientUpdate)
    }

    onDeleteClick = (e) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            const { firestore, client, history } = this.props
            firestore.delete({ collection: 'clients', doc: client.id }).then(() => history.push("/"))
        }
    }
    render() {
        const { client } = this.props
        const { showbalanceUpdate, balanceUpdateAmount } = this.state
        let balanceForm = ""
        //if balance form should be displayed
        if (showbalanceUpdate) {
            balanceForm = (
                <form
                    onSubmit={this.balanceSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            name="balanceUpdateAmount"
                            placeholder="Add New Balance"
                            value={balanceUpdateAmount}
                            onChange={this.onchange}
                        />
                        <div className="input-group-append">
                            <input type="submit" value="update" className="btn btn-outline-dark" />
                        </div>
                    </div>
                </form>
            )
        } else {
            balanceForm = null
        }
        if (!isLoaded(client)) {
            return (
                <Spinner />
            )
        }
        if (!isEmpty(client)) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <Link to="/" className="fas fa-arrow-circle-left">Back to Dashboard</Link>
                        </div>
                        <div className="col-md-6">
                            <div className="btn-group float-right" >
                                <Link to={`/client/add/${client.id}`} className="btn btn-dark">Edit</Link>
                                <button className="btn btn-danger" onClick={this.onDeleteClick}>Delete</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="card">
                        <h3 className="card-header">
                            {client.firstName} {client.lastName}
                        </h3>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-8 col-sm-6">
                                    <h4>Client ID: {" "}
                                        <span className="text-secondary">{client.id}</span>
                                    </h4>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <h3 className="pull-right">Balance:<span className={classnames({
                                        'text-danger': client.balance > 0,
                                        'text-success': client.balance === 0
                                    })} > Rs.{parseFloat(client.balance).toFixed(2)}</span>
                                        {" "}
                                        <small>
                                            <a href="#" onClick={() => this.setState({ showbalanceUpdate: !this.state.showbalanceUpdate })}><i className="fas fa-pencil-alt"></i></a>
                                        </small>
                                    </h3>
                                    {balanceForm}
                                </div>

                                <hr />
                                <ul className="list-group">
                                    <li className="list-group-item">Contact Email:{client.email}</li>
                                    <li className="list-group-item">Contact Phone:{client.phone}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            )
        } else {
            return (
                <div className="error">
                    Client Not found
                </div>
            )
        }

    }
}
ClientDetails.propTypes = {
    firestore: PropTypes.object.isRequired
}

export default compose(
    firestoreConnect(props => [
        { collection: "clients", storeAs: 'client', doc: props.match.params.id }
    ]),
    connect(({ firestore: { ordered } }, props) => ({
        client: ordered.client && ordered.client[0]
    }))
)(ClientDetails)
