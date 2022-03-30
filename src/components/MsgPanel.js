import React, { Component } from 'react';
import { Container } from 'reactstrap';
import './MsgPanel.css'

export class MsgPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const message = this.props.message;
        const status = this.props.status;
        let divClass = '';
        if (status == 'succeeded') divClass = 'alert alert-success';
        else if (status == 'failed') divClass = 'alert alert-danger';
        else if (status == 'processing') divClass = 'alert alert-secondary';

        return (
            message != '' && 
            <div id='msg-panel-wrapper'>
                <div className={divClass} >{message}</div>
            </div>
        );
    }
}