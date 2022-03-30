import React, { Component } from 'react';
import { EditWorkroom } from './EditWorkroom';
import './ListWorkrooms.css';

export class ListWorkrooms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workrooms: null,
            workroom: null,
        };

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.onEditBtnClicked = this.onEditBtnClicked.bind(this);
        this.onDeleteBtnClicked = this.onDeleteBtnClicked.bind(this);
        this.onWorkroomReseted = this.onWorkroomReseted.bind(this);
    }

    componentDidMount() {
        this.populateWorkrooms();
    }

    onBackBtnClicked() {
        this.props.onPathChanged('/');
    }

    onEditBtnClicked(workroom) {
        this.setState({
            workroom: workroom
        });
    }

    onDeleteBtnClicked(workroom) {
        const status = window.confirm('정말로 삭제하시겠습니까?');
        if (status) {
            this.props.onStatusChanged('processing', '삭제 중...');
            this.deleteWorkroom(workroom['id']);
        }
    }

    onWorkroomReseted() {
        this.populateWorkrooms();
        this.setState({
            workroom: null
        });
    }

    render() {
        const workrooms = this.state.workrooms;
        const workroom = this.state.workroom;

        return (
            <div>
                <h4 className='form-label'>작업실 수정</h4>
                {workroom == null && <button className='btn btn-secondary back-btn' onClick={this.onBackBtnClicked}>돌아가기</button>}
                {workrooms == null ? <div>Now Loading...</div> :
                workroom == null ?
                <div>
                    <table id='list-workroom-table'>
                        <thead>
                            <tr>
                                <th>작업실</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {workrooms.map((workroom, index) =>
                            <tr key={index} className={index % 2 == 0 ? 'even' : ''}>
                                <td>{workroom['name']}</td>
                                <td>
                                    <button className='btn btn-secondary' onClick={() => this.onEditBtnClicked(workroom)}>수정</button>
                                    <button className='btn btn-danger' onClick={() => this.onDeleteBtnClicked(workroom)}>삭제</button>
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div> :
                <EditWorkroom token={this.props.token} workroom={workroom} onStatusChanged={this.props.onStatusChanged} onWorkroomReseted={this.onWorkroomReseted} />
                }
            </div>
        );
    }

    async populateWorkrooms() {
        const response = await fetch('api/station', {
            method: 'GET',
            headers: {
                'Authorization': this.props.token + ''
            }
        });
        if (!response.ok) {
            console.log(response);
            this.props.onStatusChanged('failed', '데이터 불러오기 실패');
            return;
        }

        const data = await response.json();
        this.setState({
            workrooms: data['stationList']
        });
    }

    async deleteWorkroom(id) {
        const response = await fetch('api/station', {
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
            this.props.onStatusChanged('failed', '삭제 실패');
            return;
        }

        this.populateWorkrooms();
        this.props.onStatusChanged('failed', '삭제가 완료되었습니다');
    }
}