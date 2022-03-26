import React, { Component } from 'react';

export class EditData extends Component {
    constructor(props) {
        super(props);

        const now = new Date().yyyymmdd();

        this.state = {
            id: this.props.data['id'] + '',
            date: this.props.data['date'] + '',
            maxDate: now,
            workroom: this.props.data['stationName'] + '',
            workrooms: [],
            weight: this.props.data['weight'] + '',
            dateIsValid: true,
            workroomIsValid: true,
            weightIsValid: true,
        }

        this.onBackBtnClicked = this.onBackBtnClicked.bind(this);
        this.submitData = this.submitData.bind(this);
        this.onDateChanged = this.onDateChanged.bind(this);
        this.onWorkroomChanged = this.onWorkroomChanged.bind(this);
        this.onWeightKeyDown = this.onWeightKeyDown.bind(this);
        this.onWeightChanged = this.onWeightChanged.bind(this);
    }

    componentDidMount() {
        this.populateWorkrooms();
    }

    validate(date, workroom, weight) {
        let isValid = true;
        
        if (date == '') {
            this.setState({
                dateIsValid: false
            });
            isValid = false;
        }
        else {
            this.setState({
                dateIsValid: true
            });
        }
        
        if (workroom == '') {
            this.setState({
                workroomIsValid: false
            });
            isValid = false;
        }
        else {
            this.setState({
                workroomIsValid: true
            });
        }
        
        if (weight == '') {
            this.setState({
                weightIsValid: false
            });
            isValid = false;
        }
        else {
            this.setState({
                weightIsValid: true
            });
        }
        
        return isValid;
    }

    onBackBtnClicked() {
        this.props.onSpecDataReseted();
    }

    submitData(event) {
        event.preventDefault();

        const id = this.state.id;
        const date = this.state.date;
        const workroom = this.state.workroom;
        const weight = this.state.weight;

        if (!this.validate(date, workroom, weight)) return;
        this.editData(id, date, workroom, weight);
    }

    onDateChanged(event) {
        this.setState({
            date: event.target.value
        })
    }

    onWorkroomChanged(event) {
        this.setState({
            workroom: event.target.value
        });
    }

    onWeightKeyDown(event) {
        const keyCode = event.keyCode;
        if (!((keyCode >= 48 && keyCode <= 57) || (keyCode >= 37 && keyCode <= 40) || 
            (keyCode >= 96 && keyCode <= 105) || keyCode == 8 || keyCode == 13 || 
            keyCode == 35 || keyCode == 36 || keyCode == 46)) {
            event.preventDefault();
        }
    }

    onWeightChanged(event) {
        const origin = event.target.value;
        const revised = origin.replace(/(^0+)/, "");

        this.setState({
            weight: revised
        });
    }

    render() {
        const dateIsValid = this.state.dateIsValid;
        const workroomIsValid = this.state.workroomIsValid;
        const weightIsValid = this.state.weightIsValid;

        return (
            <div>
                <form onSubmit={this.submitData}>
                    <div className='form-group'>
                        <label>날짜:</label>
                        <input className={dateIsValid ? 'form-control' : 'form-control validation-control'} type='date' max={this.state.maxDate} value={this.state.date} onChange={this.onDateChanged} />
                        {!dateIsValid && <div className='validation-message'>날짜를 선택해주십시오</div>}
                    </div>
                    <div className='form-group'>
                        <label>작업실:</label>
                        <select className={workroomIsValid ? 'form-control' : 'form-control validation-control'} value={this.state.workroom} onChange={this.onWorkroomChanged}>
                            <option value=''>작업실 선택</option>      
                            {this.state.workrooms.map(workroom =>
                            <option key={workroom}>{workroom}</option>
                            )}                      
                        </select>
                        {!workroomIsValid && <div className='validation-message'>작업실을 선택해주십시오</div>}
                    </div>
                    <div className='form-group'>
                        <label>중량(t):</label>
                        <input className={weightIsValid ? 'form-control' : 'form-control validation-control'} type='number' max='1.7976931348623157E+308' min='0' value={this.state.weight} onKeyDown={this.onWeightKeyDown} onChange={this.onWeightChanged} />
                        {!weightIsValid && <div className='validation-message'>중량을 입력해주십시오</div>}
                    </div>
                    <input className='btn btn-primary' type='submit' value='수정하기' />
                    <button className='btn btn-secondary back-btn' onClick={this.onBackBtnClicked}>돌아가기</button>
                </form>
            </div>
        );
    }

    async populateWorkrooms() {
        const token = localStorage.getItem('token');

        const response = await fetch('api/station', {
            method: 'GET',
            headers: {
                'Authorization': token + ''
            }
        });
        if (!response.ok) {
            console.log(response);
            return;
        }

        const data = await response.json();
        const stationList = data['stationList'];
            for (const idx in stationList) {
                this.setState({
                    workrooms: this.state.workrooms.concat([stationList[idx]['name']])
                })
            }
    }

    async editData(id, date, workroom, weight) {
        const response = await fetch('api/data', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            },
            body: JSON.stringify({
                'id': id + '',
                'stationName': workroom + '',
                'weight': weight + '',
                'date': date + ''
            })
        });
        if (!response.ok) {
            this.onStatusChanged(false, '전송 실패');
            console.log(response);
            return;
        }

        this.props.onStatusChanged(true, '전송이 완료되었습니다');
        this.props.onSpecDataReseted();
    }
}