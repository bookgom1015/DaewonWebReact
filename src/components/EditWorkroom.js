import React, { Component } from 'react';
import removeSpecChars from './StringUtils';

export class EditWorkroom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workroomName: this.props.workroom['name'],
            workroomIsValid: true,
        };

        this.submitWokroom = this.submitWokroom.bind(this);
        this.onWorkroomNameChanged = this.onWorkroomNameChanged.bind(this);
        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
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

    submitWokroom(event) {
        event.preventDefault();

        const id = this.props.workroom['id'];
        const workroomName = this.state.workroomName;
        if (!this.validate(workroomName)) return;

        this.props.onStatusChanged('processing', '수정 중...');
        this.editWorkroom(id, workroomName);
    }

    onWorkroomNameChanged(event) {
        const value = event.target.value;
        if (value.length >= 8) return;

        const parsedName = removeSpecChars(value);

        this.setState({
            workroomName: parsedName
        });
    }

    onBackBtnClicked(event) {
        this.props.onWorkroomReseted();
    }

    render() {
        const workroomIsValid = this.state.workroomIsValid;
        return (
            <div>
                <form onSubmit={this.submitWokroom}>
                    <label>작업실:</label>
                    <input className={workroomIsValid ? 'form-control' : 'form-control validation-control'} type='text' value={this.state.workroomName} onChange={this.onWorkroomNameChanged} />
                    {!workroomIsValid && <div className='validation-message'>작업실을 입력해주십시오</div>}
                    <div className='form-submit'>
                        <input className='btn btn-primary form-btn' type='submit' value='수정하기' />
                        <button className='btn btn-secondary form-btn' onClick={this.onBackBtnClicked}>돌아가기</button>
                    </div>
                </form>
            </div>
        );
    }

    async editWorkroom(id, workroomName) {
        const response = await fetch('api/station', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            },
            body: JSON.stringify({
                'id': id + '',
                'name': workroomName + '',
            })
        });
        if (!response.ok) {
            console.log(response);
            this.props.onStatusChanged('failed', '수정 실패');
            return;
        }

        this.props.onStatusChanged('succeeded', '수정이 완료되었습니다');
        this.props.onWorkroomReseted();
    }
}