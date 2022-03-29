import React, { Component } from 'react';
import { EditAccount } from './EditAccount';
import './ListAccount.css'

export class ListAccounts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accounts: null,
            account: null,
        };

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.onEditBtnClicked = this.onEditBtnClicked.bind(this);
        this.onDeleteBtnClicked = this.onDeleteBtnClicked.bind(this);
        this.onAccountReseted = this.onAccountReseted.bind(this);
    }

    componentDidMount() {
        this.populateAccounts();
    }

    onBackBtnClicked() {
        this.props.onPathChanged('/');
    }

    onAccountReseted() {
        this.setState({
            account: null
        });
    }

    onEditBtnClicked(account) {
        this.setState({
            account: account
        });
    }

    onDeleteBtnClicked(account) {
        const status = window.confirm('정말로 삭제하시겠습니까?');
        if (status) this.deleteAccount(account['id']);
    }

    render() {
        const accounts = this.state.accounts;
        const account = this.state.account;
        return (
            <div>
                <h4 className='form-label'>계정 수정</h4>
                {account == null && <button className='btn btn-secondary back-btn' onClick={this.onBackBtnClicked}>돌아가기</button>}
                {accounts == null ? <div>Now Loading...</div> :
                account == null ?
                <div>
                    <table id='list-account-table'>
                        <thead>
                            <tr>
                                <th>아이디</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account, index) =>
                            <tr key={index} className={index % 2 == 0 ? 'even' : ''}>
                                <td>{account['userName']}</td>
                                <td>
                                    <button className='btn btn-secondary' onClick={() => this.onEditBtnClicked(account)}>수정</button>
                                    <button className='btn btn-danger' onClick={() => this.onDeleteBtnClicked(account)}>삭제</button>
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                    <br />
                    <br />
                </div> :
                <EditAccount token={this.props.token} account={account} onStatusChanged={this.props.onStatusChanged} onPathChanged={this.onPathChanged} onAccountReseted={this.onAccountReseted} />      
                }
            </div>
        );
    }

    async populateAccounts() {
        const response = await fetch('api/user', {
            method: 'GET',
            headers: {
                'Authorization': this.props.token + ''
            }            
        });
        if (!response.ok) {
            console.log(response);
            this.onStatusChanged(false, '데이터 불러오기 실패');
            return;
        }

        const data = await response.json();
        this.setState({
            accounts: data['userList']
        });
    }

    async deleteAccount(id) {
        const response = await fetch('api/user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.token + ''
            },
            body: JSON.stringify({
                'id': id
            })
        });
        if (!response.ok) {
            console.log(response);
            this.onStatusChanged(false, '삭제 실패');
            return;
        }

        this.populateAccounts();
        this.props.onStatusChanged(true, '삭제가 완료되었습니다');
    }
}