import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import './DateNav.css';
import { Mobile, PC } from './DeviceInfo.tsx';

export class DateNave extends Component {
    constructor(props) {
        super(props);

        this.onResetBtnClicked = this.onResetBtnClicked.bind(this);
        this.onYearBtnClicked = this.onYearBtnClicked.bind(this);
        this.onMonthBtnClicked = this.onMonthBtnClicked.bind(this);
        this.onDayBtnClicked = this.onDayBtnClicked.bind(this);
    }

    onResetBtnClicked() {
        this.props.onSelectedDateChanged(-1, -1, -1);
    }

    onYearBtnClicked(year) {
        this.props.onSelectedDateChanged(year, -1, -1);
    }

    onMonthBtnClicked(month) {
        this.props.onSelectedDateChanged(0, month, -1);
    }

    onDayBtnClicked(day) {
        this.props.onSelectedDateChanged(0, 0, day);        
    }

    render() {
        const selectedYear = this.props.selectedYear;
        const selectedMonth = this.props.selectedMonth;
        const selectedDay = this.props.selectedDay;

        const dateList = (
            <ul className='none-list-style'>
                <li>
                    <button className={selectedYear == -1 ? 'date-nav-btn year-nav-btn selected-nav-btn' : 'date-nav-btn year-nav-btn'} onClick={this.onResetBtnClicked}>연간 차트</button>
                </li>
                {[...this.props.dates.entries()].map(([year, monthMap]) => 
                <div key={year + ''}>
                    <li>
                        <button className={selectedYear == year ? 'date-nav-btn year-nav-btn selected-nav-btn' : 'date-nav-btn year-nav-btn'} onClick={() => this.onYearBtnClicked(year)}>{year}년</button>
                    </li>
                    {[...monthMap.entries()].map(([month, daySet]) =>
                    <Collapse key={year + '-' + month} isOpen={selectedYear == year} dimension='width'>
                        <li>
                            <button className={selectedMonth == month ? 'date-nav-btn month-nav-btn selected-nav-btn' : 'date-nav-btn month-nav-btn'} onClick={() => this.onMonthBtnClicked(month)}>{month}월</button>
                        </li>
                        {[...daySet.entries()].map(([day, notUsed]) =>
                        <Collapse key={year + '-' + month + '-' + day} isOpen={selectedMonth == month} dimension='width'>
                            <li>
                                <button className={selectedDay == day ? 'date-nav-btn day-nav-btn selected-nav-btn' : 'date-nav-btn day-nav-btn'} onClick={() => this.onDayBtnClicked(day)}>{day}일</button>
                            </li>
                        </Collapse>                            
                        )}
                    </Collapse>
                    )}
                </div>
                )}
            </ul>
        );

        return (
            <div>
                <Mobile>
                    <input id='date-nav-chk' type='checkbox' />
                    <label for='date-nav-chk'>
                        <span />
                        <span />
                        <span />
                    </label>
                    <div id='date-nav-side-bar'>
                        {dateList}
                    </div>
                </Mobile>
                <PC>
                    <div id='date-nav-wrapper'>
                        <ul className='none-list-style'>
                            {dateList}
                        </ul>
                    </div>
                </PC>
            </div>
        );
    }
}