import React, { Component } from 'react';
import removeSpecChars from './StringUtils';
import validateResponse from './ValidateResponse';

export class AddWorkroom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workroomName: '',
            workroomIsValid: true,
        };

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.submitWorkroom = this.submitWorkroom.bind(this);
        this.onWorkroomNameChanged = this.onWorkroomNameChanged.bind(this);
    }

    onBackBtnClicked() {
        this.props.onPathChanged('/');
    }

    validate(workroomName) {
        let isValid = true;

        if (workroomName == '') {
            this.setState({
                workroomIsValid: false
            });
            isValid = false;
        }
        else {
            this.setState({
                workroomIsValid: true
            });
        }

        return isValid;
    }

    submitWorkroom(event) {
        event.preventDefault();

        const workroomName = this.state.workroomName;
        if (!this.validate(workroomName)) return;

        this.props.onStatusChanged('processing', '추가 중...');
        this.sendWorkroom(workroomName);
    }

    onWorkroomNameChanged(event) {
        const value = event.target.value;
        if (value.length >= 16) return;

        const parsed = removeSpecChars(value);

        this.setState({
            workroomName: parsed
        });
    }

    render() {
        const message = this.state.message;
        const workroomIsValid = this.state.workroomIsValid;

        return (
            <div>
                <h4 className='form-label'>작업실 추가</h4>
                <form onSubmit={this.submitWorkroom}>
                    <div className='form-group'>
                        <label>작업실:</label>
                        <input className={workroomIsValid ? 'form-control' : 'form-control validation-control'} type='text' value={this.state.workroomName} onChange={this.onWorkroomNameChanged} />
                        {!workroomIsValid && <div className='validation-message'>작업실을 입력해주십시오</div>}
                    </div>
                    <div className='form-submit'>
                        <input className='btn btn-primary form-btn' type='submit' value='추가하기' />
                        <button className='btn btn-secondary form-btn' onClick={this.onBackBtnClicked}>돌아가기</button>
                    </div>
                </form>
            </div>
        );
    }

    async sendWorkroom(workroomName) {
        const response = await fetch('api/workroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            },
            body: JSON.stringify({
                'name': workroomName + '',
            })
        });
        if (!response.ok) {
            validateResponse(response);
            this.props.onStatusChanged('failed', '추가 실패');
            return;
        }

        this.props.onStatusChanged('succeeded', '추가가 완료되었습니다');
        this.props.onPathChanged('/');
    }
}