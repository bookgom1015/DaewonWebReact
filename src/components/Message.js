import React, { Component } from 'react';

export class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {
            needToUpdate: 0,
        };

        this.checkNeedToUpdate = this.checkNeedToUpdate.bind(this);
    }

    componentDidMount() {
        window.addEventListener(
            'storage', this.checkNeedToUpdate
        );
    }

    componentWillUnmount() {
        window.removeEventListener('storage', this.checkNeedToUpdate);
    }

    checkNeedToUpdate() {
        console.log('updated');
        this.setState({
            needToUpdate: this.state.needToUpdate + 1
        });
    }

    render() {
        const message = localStorage.getItem('message');
        if (message != null) {
            localStorage.removeItem('message');
        }

        return(
            <div key={this.state.needToUpdate}>
                {message}
            </div>
        );
    }
}