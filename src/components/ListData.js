import React, { Component } from 'react';
import { EditData } from './EditData';
import './ListData.css';

export class ListData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: true,
            message: '',
            data: null,
            specData: null,
        };

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.onEditBtnClicked = this.onEditBtnClicked.bind(this);
        this.onDeleteBtnClicked = this.onDeleteBtnClicked.bind(this);
        this.onSpecDataReseted = this.onSpecDataReseted.bind(this);
        this.onStatusChanged = this.onStatusChanged.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    onBackBtnClicked() {
        this.props.onPathChanged('/');
    }

    onEditBtnClicked(data) {
        this.setState({
            message: '',
            specData: data
        });
    }

    onDeleteBtnClicked(data) {
        this.onStatusChanged(true, '');
        const status = window.confirm('정말로 삭제하시겠습니까?');
        if (status) this.deleteData(data['id']);
    }

    onSpecDataReseted() {
        this.setState({
            specData: null
        });
    }

    onStatusChanged(status, message) {
        this.fetchData();
        this.setState({
            status: status,
            message: message
        });
    }

    render() {
        const message = this.state.message;
        const data = this.state.data;
        const specData = this.state.specData;

        return (
            <div>
                <h4>데이터 수정</h4>
                {message != '' && <div className={this.state.status ? 'alert alert-success' : 'alert alert-danger'} >{message}</div>}
                {specData == null && <button className='btn btn-secondary back-btn' onClick={this.onBackBtnClicked}>돌아가기</button>}
                {data == null ? <div>Now Loading...</div> :
                specData == null ?                
                <div>
                    <table id='edit-data-table'>
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>작업실</th>
                                <th>중량</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((data, index) =>
                            <tr key={index} className={index % 2 == 0 ? 'even' : ''}>
                                <td>{data['date']}</td>
                                <td>{data['stationName']}</td>
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
                <EditData token={this.props.token} data={specData} onSpecDataReseted={this.onSpecDataReseted} onStatusChanged={this.onStatusChanged} />
                }
                <br />
                <br />
            </div>
        );
    }

    async fetchData() {
        const response = await fetch('api/data', {
            method: 'GET',
            headers: {
                'Authorization': this.props.token
            }
        });
        if (!response.ok) {
            console.log(response);
            this.onStatusChanged(true, '데이터 불러오기 실패');
            return;
        }

        const data = await response.json();
        this.setState({
            data: data['data']
        });
    }

    async deleteData(id) {
        const response = await fetch('api/data', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            },
            body: JSON.stringify({
                'id': id
            })
        });
        if (!response.ok) {
            console.log(response);
            this.onStatusChanged(true, '삭제 실패');
            return;
        }

        this.fetchData();
        this.onStatusChanged(true, '삭제가 완료되었습니다');
    }
}