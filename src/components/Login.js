import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
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
        window.localStorage.setItem('token', token); 
        this.props.onTokenChanged(token);
    }

    render() {
        const idIsValid = this.state.idIsValid;
        const pwdIsValid = this.state.pwdIsValid;

        return (
            <div>
                <h4>유저 로그인</h4>
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
                    <input className='btn btn-primary' type='submit' value='로그인' />
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
            console.log(response);
            return;
        }

        const data = await response.json();
        const token = data['key'];       
        this.succeededToLogin(token);
    }
}