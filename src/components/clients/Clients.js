import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import classnames from 'classnames'
import Alert from '../layout/Alert'
import { clearNotify } from '../../actions/notifyActions'

class Clients extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    state = {
        totalOwed: null
    }

    static getDerivedStateFromProps(props, state) {
        const { clients } = props
        if (clients) {
            const total = clients.reduce((total, client) => {
                return total + parseFloat(client.balance.toString())
            }, 0)
            return { totalOwed: total }
        }
        return null;
    }


    render() {
        const { clients } = this.props
        const { message, messageType } = this.props.notify
        console.log(message)
        if (!isLoaded(clients)) {
            return <Spinner />
        }

        if (isEmpty(clients)) {
            return <div>Client List is empty</div>
        }
        const { totalOwed } = this.state

        if (clients) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <h2>
                                {' '}<i className="fas fa-users">Clients</i></h2>
                        </div>
                        <div className="col-md-6">
                            <h5 className="text-right text-secondary">
                                Total Owed {' '}
                                <span className="text-primary">
                                    Rs. {parseFloat(totalOwed).toFixed(2)}
                                </span>
                            </h5>
                        </div>
                    </div>
                    {message ? (<Alert message={message} messageType={messageType} />) : null}
                    <table className="table table-striped">
                        <thead className="thead-inverse">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id}   >
                                    <td>{client.firstName} {client.lastName}</td>
                                    <td>{client.email}</td>
                                    <td><span className={classnames({
                                        'text-success': client.balance === 0,
                                        'text-danger': client.balance > 0
                                    })}>Rs.{parseFloat(client.balance).toFixed(2)}</span></td>
                                    <td>
                                        <Link to={`/client/${client.id}`} className="btn btn-secondary btn-sm">
                                            <i className="fas fa-arrow-circle-right">Details</i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return <Spinner />
        }

    }
}

Clients.propTypes = {
    firestore: PropTypes.object.isRequired,
    clients: PropTypes.array,
    clearNotify: PropTypes.func.isRequired,
}

export default compose(
    firestoreConnect([{ collection: 'clients' }]),
    connect((state, props) => ({
        clients: state.firestore.ordered.clients,
        notify: state.notify
    }), { clearNotify })
)(Clients)
