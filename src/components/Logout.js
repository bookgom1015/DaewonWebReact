import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

export class Logout extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onTokenChanged(null);
        this.props.onStatusChanged('succeeded', '로그아웃 완료');
    }

    render() {
        return (<Navigate replace to='/login' />);
    }
}