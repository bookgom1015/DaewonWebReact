import React, { Component } from 'react';
import './Login.css';

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            userPwd: '',
            idIsValid: true,
            pwdIsValid: true,
        };

        this.onUserIdChanged = this.onUserIdChanged.bind(this);
        this.onUserPwdChanged = this.onUserPwdChanged.bind(this);
        this.submit = this.submit.bind(this);
    }

    onUserIdChanged(event) {
        this.setState({
            userId: event.target.value
        });
    }

    onUserPwdChanged(event) {
        this.setState({
            userPwd: event.target.value
        });
    }

    validate(userId, userPwd) {
        let isValid = true;

        if (userId == '') {
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
        if (userPwd == '') {
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

    submit(event) {
        event.preventDefault();

        const userId = this.state.userId;
        const userPwd = this.state.userPwd;
        
        if (!this.validate(userId, userPwd));

        this.props.onStatusChanged('processing', '로그인 중...');
        this.authorize(userId, userPwd);

        this.setState({
            userPwd: ''
        });
    }

    render() {
        const idIsValid = this.state.idIsValid;
        const pwdIsValid = this.state.pwdIsValid;

        return (
            <div>
                <h4 className='form-label'>유저 로그인</h4>
                <form onSubmit={this.submit}>
                    <div className='form-group'>
                        <label>아이디:</label>
                        <input className={idIsValid ? 'form-control' : 'form-control validation-control'} type='text' value={this.state.userId} onChange={this.onUserIdChanged} />
                        {!idIsValid && <div className='validation-message'>아이디를 입력해주십시오</div>}
                    </div>
                    <div className='form-group'>
                        <label>패스워드</label>
                        <input className={pwdIsValid ? 'form-control' : 'form-control validation-control'} type='password' value={this.state.userPwd} onChange={this.onUserPwdChanged} />
                        {!pwdIsValid && <div className='validation-message'>패스워드를 입력해주십시오</div>}
                    </div>
                    <div className='form-submit'>
                        <input className='btn btn-primary' type='submit' value='로그인' />
                    </div>
                </form>
            </div>
        );
    }

    async authorize(userId, userPwd) {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'userId': userId + '',
                'userPassword': userPwd + ''
            })
        });
        if (!response.ok) {
            this.props.onStatusChanged('failed', '아이디 또는 비밀번호가 일치하지 않습니다');
            return;
        }

        const data = await response.json();
        const token = data['key'];
        
        this.props.onStatusChanged('succeeded', '로그인 성공');
        this.props.onTokenChanged(token);
    }
}