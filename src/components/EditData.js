import React, { Component } from 'react';
import validateResponse from './ValidateResponse';

export class EditData extends Component {
    constructor(props) {
        super(props);

        const now = new Date().yyyymmdd();

        this.state = {
            uid: this.props.data['uid'] + '',
            date: this.props.data['date'] + '',
            maxDate: now,
            workroom: this.props.data['workroom'] + '',
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

        const uid = this.state.uid;
        const date = this.state.date;
        const workroom = this.state.workroom;
        const weight = this.state.weight;

        if (!this.validate(date, workroom, weight)) return;

        this.props.onStatusChanged('processing', '?????? ???...');
        this.editData(uid, date, workroom, weight);
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
                        <label>??????:</label>
                        <input className={dateIsValid ? 'form-control' : 'form-control validation-control'} type='date' max={this.state.maxDate} value={this.state.date} onChange={this.onDateChanged} />
                        {!dateIsValid && <div className='validation-message'>????????? ?????????????????????</div>}
                    </div>
                    <div className='form-group'>
                        <label>?????????:</label>
                        <select className={workroomIsValid ? 'form-control' : 'form-control validation-control'} value={this.state.workroom} onChange={this.onWorkroomChanged}>
                            <option value=''>????????? ??????</option>      
                            {this.state.workrooms.map(workroom =>
                            <option key={workroom}>{workroom}</option>
                            )}                      
                        </select>
                        {!workroomIsValid && <div className='validation-message'>???????????? ?????????????????????</div>}
                    </div>
                    <div className='form-group'>
                        <label>??????(t):</label>
                        <input className={weightIsValid ? 'form-control' : 'form-control validation-control'} type='number' max='1.7976931348623157E+308' min='0' value={this.state.weight} onKeyDown={this.onWeightKeyDown} onChange={this.onWeightChanged} />
                        {!weightIsValid && <div className='validation-message'>????????? ?????????????????????</div>}
                    </div>
                    <div className='form-submit'>
                        <input className='btn btn-primary form-btn' type='submit' value='????????????' />
                        <button className='btn btn-secondary form-btn' onClick={this.onBackBtnClicked}>????????????</button>
                    </div>
                </form>
            </div>
        );
    }

    async populateWorkrooms() {
        const response = await fetch('api/workroom', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        });
        if (!response.ok) {
            validateResponse(response);
            this.props.onStatusChanged('failed', '????????? ???????????? ??????');
            this.props.onSpecDataReseted();
            return;
        }

        const data = await response.json();
        const workrooms = data;
            for (const idx in workrooms) {
                this.setState({
                    workrooms: this.state.workrooms.concat([workrooms[idx]['name']])
                })
            }
    }

    async editData(uid, date, workroom, weight) {
        const response = await fetch('api/steel', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            },
            body: JSON.stringify({
                'uid': Number(uid),
                'date': date + '',
                'workroom': workroom + '',
                'weight': weight + '',
            })
        });
        if (!response.ok) {
            validateResponse(response);
            this.props.onStatusChanged('failed', '?????? ??????');
            return;
        }

        this.props.onStatusChanged('succeeded', '????????? ?????????????????????');
        this.props.onSpecDataReseted();
    }
}