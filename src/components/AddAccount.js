import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

export class AddAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            userPwd: '',
            idIsValid: true,
            pwdIsValid: true,
        };

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.submitWorkroom = this.submitWorkroom.bind(this);
        this.onUserIdChanged = this.onUserIdChanged.bind(this);
        this.onUserPwdChanged = this.onUserPwdChanged.bind(this);
        this.onUserPwdKeyDown = this.onUserPwdKeyDown.bind(this);
    }

    onBackBtnClicked() {
        this.props.onPathChanged('/');
    }

    validate(id, pwd) {
        let isValid = true;

        if (id == '') {
            this.setState({
                idIsValid: false
            });
            isValid = false;
        }
        else {
            this.setState({
                idIsValid: true
            });
        }

        if (pwd == '') {
            this.setState({
                pwdIsValid: false
            });
            isValid = false;
        }
        else {
            this.setState({
                pwdIsValid: true
            });
        }

        return isValid;
    }

    submitWorkroom(event) {
        event.preventDefault();

        const id = this.state.userId;
        const pwd = this.state.userPwd;
        if (!this.validate(id, pwd)) return;

        this.addAccount(id, pwd);
    }

    onUserIdChanged(event) {
        const value = event.target.value;
        if (value.length >= 16) return;

        this.setState({
            userId: value
        });
    }

    onUserPwdChanged(event) {
        const value = event.target.value;
        if (value.length >= 16) return;

        this.setState({
            userPwd: value
        });
    }

    onUserPwdKeyDown(event) {
        const keyCode = event.keyCode;
        if (!((keyCode >= 48 && keyCode <= 57) || (keyCode >= 37 && keyCode <= 40) || (keyCode >= 65 && keyCode <= 90) ||
            (keyCode >= 96 && keyCode <= 105) || keyCode == 8 || keyCode == 13 || 
            keyCode == 35 || keyCode == 36 || keyCode == 46)) {
            event.preventDefault();
        }
    }

    render() {
        const idIsValid = this.state.idIsValid;
        const pwdIsValid = this.state.pwdIsValid;

        return (
            <div>
                <h4 className='form-label'>계정 추가</h4>
                <form onSubmit={this.submitWorkroom}>
                    <div className='form-group'>
                        <label>아이디:</label>
                        <input className={idIsValid ? 'form-control' : 'form-control validation-control'} type='text' value={this.state.userId} onChange={this.onUserIdChanged} />
                        {!idIsValid && <div className='validation-message'>아이디를 입력해주십시오</div>}
                    </div>
                    <div className='form-group'>
                        <label>패스워드:</label>
                        <input className={pwdIsValid ? 'form-control' : 'form-control validation-control'} type='password' value={this.state.userPwd} onChange={this.onUserPwdChanged} onKeyDown={this.onUserPwdKeyDown} />
                        {!pwdIsValid && <div className='validation-message'>비밀번호를 입력해주십시오</div>}
                    </div>
                    <div className='form-submit'>
                        <input className='btn btn-primary form-btn' type='submit' value='추가하기' />
                        <button className='btn btn-secondary form-btn' onClick={this.onBackBtnClicked}>돌아가기</button>
                    </div>
                </form>
            </div>
        );
    }

    async addAccount(id, pwd) {
        const response = await fetch('api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.token + ''
            },
            body: JSON.stringify({
                'userName': id + '',
                'userPassword': pwd + '',
            })
        });
        if (!response.ok) {
            console.log(response);
            this.props.onStatusChanged(false, '전송 실패');
            return;
        }

        this.props.onStatusChanged(true, '계정 생성이 완료되었습니다');
        this.props.onPathChanged('/');
    }
}