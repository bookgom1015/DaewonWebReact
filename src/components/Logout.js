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
        if (this.props.token == null) return;
        
        this.props.onStatusChanged('succeeded', '로그아웃 완료');
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