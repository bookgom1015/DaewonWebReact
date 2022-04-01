import React, { Component } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Mobile, PC } from './DeviceInfo.tsx';
import validateResponse from './ValidateResponse';
import setComma from './DecimalSeperator';

Chart.register(...registerables);

const backgroundColors = [
  'rgba(37, 184, 197, 0.4)',
  'rgba(255, 155, 153, 0.4)',
  'rgba(255, 247, 99, 0.4)',
  'rgba(28, 159, 246, 0.4)',
  'rgba(35, 40, 227, 0.4)',
  'rgba(112, 255, 202, 0.4)',
];

const borderColors = [
  'rgb(99, 78, 66)',
  'rgb(255, 140, 140)',
  'rgb(144, 246, 28)',
  'rgb(76, 182, 252)',
  'rgb(216, 104, 255)',
  'rgb(255, 201, 27)',
];

export class ChartPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      workroomMap: null,
  };
  }

  componentDidMount() {
    this.populateWorkrooms();
  }

  render() {
    const workroomMap = this.state.workroomMap;
    if (workroomMap == null) return (<div>Now Loading...</div>);

    const labels = [...this.props.labels];
    const suffixLabels = labels.map((date) => date + this.props.dateSuffix);
    const datasets = [...this.props.datasets].map(([workroom, dateMap], index) => (
      {
        label: workroom,
        data: labels.map((date) => dateMap.get(date)),
        backgroundColor: backgroundColors[(workroomMap.get(workroom) - 1) % backgroundColors.length],
        borderWidth: 4,
        borderColor: borderColors[(workroomMap.get(workroom) - 1) % borderColors.length],
        maxBarThickness: 64
      }      
    ));

    const chartData = {
      labels: suffixLabels,
      datasets: datasets
    };

    const dateSuffix = this.props.dateSuffix;
    const dataSuffix = this.props.dataSuffix;

    return (
      <div>
        <Mobile>
          <Bar 
            data={chartData}
            options={
              {
                responsive: true,
                aspectRatio: 0.5,
                indexAxis: 'y',
                plugins: {
                  title: {
                    display: true,
                    text: this.props.title,
                    font: {
                      size: 18
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return ' ' + setComma(context.dataset.data[context.dataIndex]) + ' kg';
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      callback: function (value, index, ticks) {
                        return (value / 1000) + ' t';
                      }
                    }
                  }
                }               
              }
            } 
          />
          <br />
          <br />
        </Mobile>
        <PC>
          <Bar 
            data={chartData}
            options={
              {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: this.props.title,
                    font: {
                      size: 18
                    } 
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return ' ' + setComma(context.dataset.data[context.dataIndex]) + ' kg';
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: function (value, index, ticks) {
                        return (value / 1000) + ' t';
                      }
                    }
                  }
                }
              }
            } 
          />
        </PC>
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
        this.props.onStatusChanged('failed', '데이터 불러오기 실패');
        return;
    }

    const data = await response.json();
    const workrooms = data;
    let map = new Map();
    for (const idx in workrooms) {
        map.set(workrooms[idx]['name'], workrooms[idx]['uid']);
    }

    this.setState({
        workroomMap: map
    });
  }
}