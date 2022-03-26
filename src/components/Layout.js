import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavMenu isAdmin={this.props.isAdmin} />
                <Container>
                    {this.props.children}
                </Container>
            </div>
        )
    }
}