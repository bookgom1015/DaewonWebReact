import React, { Component } from 'react';
import { EditData } from './EditData';
import validateResponse from './ValidateResponse';
import './ListData.css';

export class ListData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            specData: null,
        };

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.onEditBtnClicked = this.onEditBtnClicked.bind(this);
        this.onDeleteBtnClicked = this.onDeleteBtnClicked.bind(this);
        this.onSpecDataReseted = this.onSpecDataReseted.bind(this);
    }

    componentDidMount() {
        this.populateData();
    }

    onBackBtnClicked() {
        this.props.onPathChanged('/');
    }

    onEditBtnClicked(data) {
        this.setState({
            specData: data
        });
    }

    onDeleteBtnClicked(data) {
        const status = window.confirm('정말로 삭제하시겠습니까?');
        if (status) {
            this.props.onStatusChanged('processing', '삭제 중...');
            this.deleteData(data['uid']);
        }
    }

    onSpecDataReseted() {
        this.populateData();
        this.setState({
            specData: null
        });
    }

    render() {
        const data = this.state.data;
        const specData = this.state.specData;

        return (
            <div>
                <h4 className='form-label'>데이터 수정</h4>
                {specData == null && <button className='btn btn-secondary back-btn' onClick={this.onBackBtnClicked}>돌아가기</button>}
                {data == null ? <div>Now Loading...</div> :
                specData == null ?                
                <div>
                    <table id='edit-data-table'>
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>작업실</th>
                                <th>중량(kg)</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((data, index) =>
                            <tr key={index} className={index % 2 == 0 ? 'even' : ''}>
                                <td>{data['date']}</td>
                                <td>{data['workroom']}</td>
                                <td>{data['weight']}</td>
                                <td>
                                    <button className='btn btn-secondary' onClick={() => this.onEditBtnClicked(data)}>수정</button>
                                    <button className='btn btn-danger' onClick={() => this.onDeleteBtnClicked(data)}>삭제</button>
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div> :
                <EditData token={this.props.token} data={specData} onSpecDataReseted={this.onSpecDataReseted} onStatusChanged={this.props.onStatusChanged} />
                }
                <br />
                <br />
            </div>
        );
    }

    async populateData() {
        const response = await fetch('api/steel', {
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
            data: data
        });
    }

    async deleteData(uid) {
        const response = await fetch('api/steel', {
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

        this.populateData();
        this.props.onStatusChanged('succeeded', '삭제가 완료되었습니다');
    }
}