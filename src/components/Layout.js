import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { MsgPanel } from './MsgPanel';
import './Layout.css'

export class Layout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavMenu token={this.props.token} isAdmin={this.props.isAdmin} />
                <Container id='container'>
                    {this.props.children}
                    <MsgPanel status={this.props.status} message={this.props.message} />        
                </Container>
            </div>
        )
    }
}