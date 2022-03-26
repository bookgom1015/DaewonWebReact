import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

export class Logout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedOut: false
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token == null) return;

        localStorage.removeItem('token');
        this.props.onTokenChanged(null);
        this.setState({
            loggedOut: true
        });
    }

    render() {
        if (this.state.loggedOut) {
            return (<Navigate replace to='/login' />);
        }

        return (
            <div></div>
        );
    }
}