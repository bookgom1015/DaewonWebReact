import React, { Component } from 'react';
import { ListData } from './ListData';
import { ListWorkrooms } from './ListWorkrooms';
import { ListAccounts } from './ListAccounts';
import { AddWorkroom } from './AddWorkroom';
import { AddAccount } from './AddAccount';
import './Admin.css'

export class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            path: '/',            
        };

        this.onEditDataBtnClicked = this.onEditDataBtnClicked.bind(this);
        this.onAddWorkroomBtnClicked = this.onAddWorkroomBtnClicked.bind(this);
        this.onEditWorkroomsBtnClicked = this.onEditWorkroomsBtnClicked.bind(this);
        this.onAddAccountBtnClicked = this.onAddAccountBtnClicked.bind(this);
        this.onEditAccountsBtnClicked = this.onEditAccountsBtnClicked.bind(this);
        this.onPathChanged = this.onPathChanged.bind(this);
    }

    onEditDataBtnClicked() {
        this.setState({
            path: '/data/edit'
        });
    }

    onAddWorkroomBtnClicked() {
        this.setState({
            path: '/workroom/add'
        });
    }

    onEditWorkroomsBtnClicked() {
        this.setState({
            path: '/workroom/edit'
        });
    }

    onAddAccountBtnClicked() {
        this.setState({
            path: '/account/add'
        });
    }

    onEditAccountsBtnClicked() {
        this.setState({
            path: '/account/edit'
        });
    }

    onPathChanged(newPath) {
        this.setState({
            path: newPath
        });
    }

    render() {
        return (
            <div>
                {this.state.path == '/' &&
                <div>
                    <h4 className='form-label'>관리자 패널</h4>
                    <div className='admin-form-group'>
                        <label className='admin-label'>데이터</label>
                        <div>
                            <span><button className='btn btn-warning' onClick={this.onEditDataBtnClicked}>데이터 수정</button></span>
                        </div>
                    </div>
                    <div className='admin-form-group'>
                        <label className='admin-label'>작업실</label>
                        <div>
                            <span><button className='btn btn-secondary' onClick={this.onAddWorkroomBtnClicked}>작업실 추가</button></span>
                            <span><button className='btn btn-warning' onClick={this.onEditWorkroomsBtnClicked}>작업실 수정</button></span>
                        </div>
                    </div>
                    <div className='admin-form-group'>
                        <label className='admin-label'>계정</label>
                        <div>
                            <span><button className='btn btn-secondary' onClick={this.onAddAccountBtnClicked}>계정 추가</button></span>
                            <span><button className='btn btn-warning' onClick={this.onEditAccountsBtnClicked}>계정 수정</button></span>
                        </div>
                    </div>
                </div>    
                }
                {this.state.path == '/data/edit' &&
                <ListData token={this.props.token} onStatusChanged={this.props.onStatusChanged} onPathChanged={this.onPathChanged} />
                }
                {this.state.path == '/workroom/add' &&
                <AddWorkroom token={this.props.token} onStatusChanged={this.props.onStatusChanged} onPathChanged={this.onPathChanged} />
                }
                {this.state.path == '/workroom/edit' &&
                <ListWorkrooms token={this.props.token} onStatusChanged={this.props.onStatusChanged} onPathChanged={this.onPathChanged} />
                }
                {this.state.path == '/account/add' &&
                <AddAccount token={this.props.token} onStatusChanged={this.props.onStatusChanged} onPathChanged={this.onPathChanged} />
                }
                {this.state.path == '/account/edit' &&
                <ListAccounts token={this.props.token} onStatusChanged={this.props.onStatusChanged} onPathChanged={this.onPathChanged} />
                }
            </div>
        );
    }
}