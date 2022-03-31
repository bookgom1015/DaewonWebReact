import React, { Component } from 'react';
import { EditAccount } from './EditAccount';
import validateResponse from './ValidateResponse';
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
        if (status) {
            this.props.onStatusChanged('processing', '삭제 중...');
            this.deleteAccount(account['uid']);
        }
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
                                <td>
                                    {account['user_id']}
                                    {account['is_admin'] && <span className='alert alert-primary admin-tag'>Admin</span>}
                                </td>
                                <td>
                                    <button className='btn btn-secondary' disabled={account['is_admin']} onClick={() => this.onEditBtnClicked(account)}>수정</button>
                                    <button className='btn btn-danger' disabled={account['is_admin']} onClick={() => this.onDeleteBtnClicked(account)}>삭제</button>
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
                'Authorization': 'Bearer ' + this.props.token
            }            
        });
        if (!response.ok) {
            validateResponse(response);
            this.props.onStatusChanged('failed', '데이터 불러오기 실패');
            return;
        }

        const data = await response.json();
        this.setState({
            accounts: data
        });
    }

    async deleteAccount(uid) {
        const response = await fetch('api/user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            },
            body: JSON.stringify({
                'uid': uid
            })
        });
        if (!response.ok) {
            validateResponse(response);
            this.props.onStatusChanged('failed', '삭제 실패');
            return;
        }

        this.populateAccounts();
        this.props.onStatusChanged('failed', '삭제가 완료되었습니다');
    }
}