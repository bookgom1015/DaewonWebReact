import React, { Component } from 'react';

function removeSpeicalCharacters(str){  
    var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    if(reg.test(str)) return str.replace(reg, "");
    
    return str;
}

export class EditAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userPwd: '',
            pwdIsValid: true,
        }

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.submitAccount = this.submitAccount.bind(this);
        this.onUserPwdChanged = this.onUserPwdChanged.bind(this);
        this.onUserPwdKeyDown = this.onUserPwdKeyDown.bind(this);
    }

    onBackBtnClicked() {
        this.props.onAccountReseted();
    }

    validate(pwd) {
        let isValid = true;

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

    submitAccount(event) {
        event.preventDefault();

        const userPwd = this.state.userPwd;
        if (!this.validate(userPwd)) return;

        const id = this.props.account['id'];
        this.sendAccount(id, userPwd);
    }

    onUserPwdChanged(event) {
        const value = event.target.value;
        if (value.length >= 16) return;

        const parsedPwd = removeSpeicalCharacters(value);

        this.setState({
            userPwd: parsedPwd
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
        const pwdIsValid = this.state.pwdIsValid;

        return (
            <div>
                <form onSubmit={this.submitAccount}>
                    <div className='form-group'>
                        <label>아이디:</label>
                        <input className='form-control' type='text' value={this.props.account['userName']} readOnly />
                    </div>
                    <div className='form-group'>
                        <label>패스워드:</label>
                        <input className={pwdIsValid ? 'form-control' : 'form-control validation-control'} type='password' value={this.state.userPwd} onChange={this.onUserPwdChanged} />
                        {!pwdIsValid && <div className='validation-message'>패스워드를 입력해주십시오</div>}
                    </div>
                    <div className='form-submit'>
                        <input className='btn btn-primary form-btn' type='submit' value='수정하기' />
                        <button className='btn btn-secondary form-btn' onClick={this.onBackBtnClicked}>돌아가기</button>
                    </div>
                </form>
            </div>
        );
    }
    
    async sendAccount(id, userPwd) {
        const response = await fetch('api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            },
            body: JSON.stringify({
                'id': id + '',
                'userPassword': userPwd + '',
            })
        });
        if (!response.ok) {
            console.log(response);
            this.props.onStatusChanged(false, '수정 실패');
            return;
        }

        const data = response.json();
        this.props.onStatusChanged(true, '수정이 완료되었습니다');
        this.props.onAccountReseted();
    }
}