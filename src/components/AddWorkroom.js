import React, { Component } from 'react';

export class AddWorkroom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workroomName: '',
        };

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.submitWorkroom = this.submitWorkroom.bind(this);
        this.onWorkroomNameChanged = this.onWorkroomNameChanged.bind(this);
    }

    onBackBtnClicked() {
        this.props.onPathChanged('/');
    }

    submitWorkroom(event) {
        event.preventDefault();
    }

    onWorkroomNameChanged(event) {
        const value = event.target.value;
        if (value.length >= 16) return;

        this.setState({
            workroomName: value
        });
    }

    render() {
        const message = this.state.message;

        return (
            <div>
                <h4 className='form-label'>작업실 추가</h4>
                <form onSubmit={this.submitWorkroom}>
                    <div className='form-group'>
                        <label>작업실:</label>
                        <input className='form-control' type='text' value={this.state.workroomName} onChange={this.onWorkroomNameChanged} />
                    </div>
                    <div className='form-submit'>
                        <input className='btn btn-primary form-btn' type='submit' value='추가하기' />
                        <button className='btn btn-secondary form-btn' onClick={this.onBackBtnClicked}>돌아가기</button>
                    </div>
                </form>
            </div>
        );
    }
}