import React, { Component } from 'react';
import { Container } from 'reactstrap';
import './MsgPanel.css'

export class MsgPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const message = this.props.message;

        return (
            <div id='msg-panel-wrapper'>
                {message != '' && <div className={this.props.status ? 'alert alert-success' : 'alert alert-danger'} >{message}</div>}
            </div>
        );
    }
}