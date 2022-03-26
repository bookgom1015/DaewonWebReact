import React, { Component } from 'react';
import { ListData } from './ListData';
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

    }

    onEditWorkroomsBtnClicked() {

    }

    onAddAccountBtnClicked() {

    }

    onEditAccountsBtnClicked() {

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
                    <h4>관리자 패널</h4>
                    <div className='admin-form-group'>
                        <label className='admin-label'>데이터</label>
                        <div>
                            <span><button className='btn btn-warning' onClick={this.onEditDataBtnClicked}>데이터 수정</button></span>
                        </div>
                    </div>
                    <div className='admin-form-group'>
                        <label className='admin-label'>작업실</label>
                        <div>
                            <span><button className='btn btn-secondary'>작업실 추가</button></span>
                            <span><button className='btn btn-warning'>작업실 수정</button></span>
                        </div>
                    </div>
                    <div className='admin-form-group'>
                        <label className='admin-label'>계정</label>
                        <div>
                            <span><button className='btn btn-secondary'>계정 추가</button></span>
                            <span><button className='btn btn-warning'>계정 수정</button></span>
                        </div>
                    </div>
                </div>    
                }
                {this.state.path == '/data/edit' &&
                <ListData token={this.props.token} onPathChanged={this.onPathChanged} />
                }
            </div>
        );
    }
}