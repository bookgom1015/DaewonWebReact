import React, { Component } from 'react';
import './Login.css';

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            pwd: '',
            idIsValid: true,
            pwdIsValid: true,
        };

        this.onIdChanged = this.onIdChanged.bind(this);
        this.onPwdChanged = this.onPwdChanged.bind(this);
        this.submit = this.submit.bind(this);
    }

    onIdChanged(event) {
        this.setState({
            id: event.target.value
        });
    }

    onPwdChanged(event) {
        this.setState({
            pwd: event.target.value
        });
    }

    submit(event) {
        event.preventDefault();
        let isValid = true;

        if (this.state.id == '') {
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
        if (this.state.pwd == '') {
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
        if (!isValid) return;

        this.authorize();
    }

    succeededToLogin(token) {
        this.props.onTokenChanged(token);
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
                        <input className={idIsValid ? 'form-control' : 'form-control validation-control'} type='text' value={this.state.id} onChange={this.onIdChanged} />
                        {!idIsValid && <div className='validation-message'>아이디를 입력해주십시오</div>}
                    </div>
                    <div className='form-group'>
                        <label>패스워드</label>
                        <input className={pwdIsValid ? 'form-control' : 'form-control validation-control'} type='password' value={this.state.pwd} onChange={this.onPwdChanged} />
                        {!pwdIsValid && <div className='validation-message'>패스워드를 입력해주십시오</div>}
                    </div>
                    <div className='form-submit'>
                        <input className='btn btn-primary' type='submit' value='로그인' />
                    </div>
                </form>
            </div>
        );
    }

    async authorize() {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'userId': this.state.id + '',
                'userPassword': this.state.pwd + ''
            })
        });
        if (!response.ok) {
            this.props.onStatusChanged(false, '아이디 또는 비밀번호가 일치하지 않습니다');
            this.setState({
                pwd: ''
            });
            return;
        }

        const data = await response.json();
        const token = data['key'];       
        this.succeededToLogin(token);
    }
}