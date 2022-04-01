import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { DateNave } from './DateNav';
import { ChartPanel } from './ChartPanel';
import validateResponse from './ValidateResponse';
import './ShowChart.css'

export class ShowChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            dates: null,
            datasets: null,
            labels: null,
            selectedYear: -1,
            selectedMonth: -1,
            selectedDay: -1,
            title: '연간 차트', 
            dateSuffix: '년',
        }

        this.onSelectedDateChanged = this.onSelectedDateChanged.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    onSelectedDateChanged(year, month, day) {
        const selectedYear = year == 0 ? this.state.selectedYear : year;
        const selectedMonth = month == 0 ? this.state.selectedMonth : month;
        const selectedDay = day == 0 ? this.state.selectedDay : day;

        this.populateData(this.state.data, selectedYear, selectedMonth, selectedDay);

        let title;
        let dateSuffix;
        if (selectedYear == -1) {
            title = '연간 차트';
            dateSuffix = '년';
        }
        else if (selectedMonth == -1) {
            title = '월간 차트';
            dateSuffix = '월';
        }
        else if (selectedDay == -1) {
            title = '일간 차트';
            dateSuffix = '일';
        }
        else {
            title = '일일 차트';
            dateSuffix = '일';
        }

        this.setState({
            selectedYear: selectedYear,
            selectedMonth: selectedMonth,
            selectedDay: selectedDay,
            title: title,
            dateSuffix: dateSuffix,
        });
    }

    render() {
        const datasets = this.state.datasets;
        const labels = this.state.labels;

        return (
            this.state.data != null ?
            <div className='show-chart-wrapper'>
                <div id='chart-panel-wrapper'>
                    {datasets != null && labels != null && 
                    <ChartPanel token={this.props.token} onStatusChanged={this.props.onStatusChanged} datasets={datasets} labels={labels} title={this.state.title} dateSuffix={this.state.dateSuffix} />
                    }
                </div>
                {this.state.dates != null &&
                <div id='date-nav-wrapper'>
                    <DateNave dates={this.state.dates} onSelectedDateChanged={this.onSelectedDateChanged}
                        selectedYear={this.state.selectedYear} selectedMonth={this.state.selectedMonth} selectedDay={this.state.selectedDay} />
                </div>
                }
            </div> :
            <div>
                Now Loading...
            </div>
        );
    }

    async fetchData() {
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
        const innerData = data;
        this.setState({
            data: innerData 
        });
        this.populateData(innerData, -1, -1, -1);
    }

    populateDatasets(datasets, date, workroom, weight) {
        if (!datasets.has(workroom)) datasets.set(workroom, new Map());
        let workroomMap = datasets.get(workroom);

        if (!workroomMap.has(date)) {
            workroomMap.set(date, weight);
        }
        else {
            let prevWeight = workroomMap.get(date);
            workroomMap.set(date, weight + prevWeight);
        }
    }

    async populateData(data, selectedYear, selectedMonth, selectedDay) {
        let dates = new Map();
        let labels = new Set();
        let datasets = new Map();

        for (const idx in data) {
            const specData = data[idx];
            const date = specData['date'] + '';
            const workroom = specData['workroom'] + '';
            const weight = specData['weight'];

            const year = date.substring(0, 4);
            const month = date.substring(5, 7);
            const day = date.substring(8, 10);

            if (!dates.has(year)) dates.set(year, new Map());
            let monthMap = dates.get(year);

            if (!monthMap.has(month)) monthMap.set(month, new Set());
            let daySet = monthMap.get(month);
            daySet.add(day);

            if (selectedYear == -1) {
                labels.add(year);
                this.populateDatasets(datasets, year, workroom, weight);
            }
            else if (selectedMonth == -1 && year == selectedYear) {
                labels.add(month);
                this.populateDatasets(datasets, month, workroom, weight);
            }
            else if (selectedDay == -1 && year == selectedYear && month == selectedMonth) {
                labels.add(day);
                this.populateDatasets(datasets, day, workroom, weight);
            }
            else if (year == selectedYear && month == selectedMonth && day == selectedDay) {
                labels.add(day);
                this.populateDatasets(datasets, day, workroom, weight);
            }
        }

        this.setState({
            dates: dates,
            labels: labels,
            datasets: datasets,
        });
    }
}