import React, { Component } from 'react';
import './ListWorkrooms.css';

export class ListWorkrooms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workrooms: null,
        };

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.onEditBtnClicked = this.onEditBtnClicked.bind(this);
        this.onDeleteBtnClicked = this.onDeleteBtnClicked.bind(this);
    }

    componentDidMount() {
        this.populateWorkrooms();
    }

    onBackBtnClicked() {
        this.props.onPathChanged('/');
    }

    onEditBtnClicked(workroom) {

    }

    onDeleteBtnClicked(workroom) {
        
    }

    render() {
        const workrooms = this.state.workrooms;

        return (
            <div>
                <h4 className='form-label'>작업실 수정</h4>
                <button className='btn btn-secondary back-btn' onClick={this.onBackBtnClicked}>돌아가기</button>
                {workrooms != null ?
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
                <div>Now Loading...</div>
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
            this.props.onStatusChanged(false, '데이터 불러오기 실패');
            return;
        }

        const data = await response.json();
        this.setState({
            workrooms: data['stationList']
        });
    }
}