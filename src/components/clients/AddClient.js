import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import { notifyUser } from '../../actions/notifyActions'
class AddClient extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            balance: "",
            update: false

        }
    }
    onChange = (event) => {
        console.log(this.state)
        this.setState({
            [event.target.name]: event.target.value
        })
        console.log(this.state)
    }
    static getDerivedStateFromProps(props, state) {
        console.log("getDerivedStateFromProps")
        if (state.id === '-1') {
            return null
        }
        if (props.client && !state.update) {
            const { firstName, lastName, email, phone, balance } = state.update ? state : props.client
            return {
                firstName, lastName, email, phone, balance, update: true
            }
        }
        return null

    }


    onSubmit = (event) => {
        event.preventDefault()
        const client = this.state
        const { notifyUser } = this.props
        const { firestore, history } = this.props
        //if no balance, make zero
        if (client.balance === '') {
            client.balance = 0
        }
        if (client.id === '-1') {
            const { firstName, lastName, phone, email, balance } = client
            const newClient = { firstName, lastName, phone, email, balance }
            firestore.add({ collection: 'clients' }, newClient).then(() => {
                notifyUser("Client Added Successfully", "success")
                history.push("/")
            })
        } else {
            firestore.update({ collection: 'clients', doc: client.id }, client).then(() => {
                notifyUser("Client Updated Successfully", "success")
                history.push("/")
            })
        }
    }

    componentDidMount() {
        console.log("componentDidMount")
        console.log(this.props)
    }


    render() {
        const { id } = this.state
        const { disableBalanceOnAdd, disableBalanceOnEdit } = this.props.settings
        console.log(id, typeof (id))
        const disableBalance = id === '-1' ? disableBalanceOnAdd : disableBalanceOnEdit
        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <Link to="/" className="btn btn-link">
                            <i className="fas fa-arrow-circle-left">Back To Dashboard</i>
                        </Link>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">Add Client</div>
                    <div className="card-body">
                        <form
                            onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="firstName">
                                    First Name
                                    </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="firstName"
                                    minLength="2"
                                    required
                                    onChange={this.onChange}
                                    value={this.state.firstName} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">
                                    Last Name
                                    </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="lastName"
                                    minLength="2"
                                    required
                                    onChange={this.onChange}
                                    value={this.state.lastName} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">
                                    Email
                                    </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    onChange={this.onChange}
                                    value={this.state.email} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">
                                    Phone
                                    </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    minLength="10"
                                    required
                                    onChange={this.onChange}
                                    value={this.state.phone} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="balance">
                                    Balance
                                    </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="balance"
                                    onChange={this.onChange}
                                    value={this.state.balance}
                                    disabled={disableBalance} />
                            </div>
                            <input type="submit" value="Submit" className="btn btn-primary btn-block" />
                        </form>
                    </div>
                </div>
            </div>
        )

    }
}
AddClient.propTypes = {
    firestore: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    notifyUser: PropTypes.func.isRequired,
}

export default compose(
    firestoreConnect(props => [
        { collection: "clients", storeAs: 'client', doc: props.match.params.id }
    ]),
    connect(({ firestore: { ordered }, settings }, props) => ({
        settings,
        client: ordered.client && ordered.client[0]
    }), { notifyUser })
)(AddClient)
