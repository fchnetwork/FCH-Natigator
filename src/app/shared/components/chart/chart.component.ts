import { Component, OnInit } from '@angular/core';
import echarts from 'echarts/lib/echarts'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  chartOption = {
    textStyle: {
        color: 'rgb(131, 134, 138)',
        fontFamily: 'Open Sans, sans-serif',
        align: 'left',
        baseline: 'bottom'
    },
    grid: {
        x: 30,
        y: 20,
        x2: 20,
        y2: 20
    },
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['20.01', '21.01', '22.01', '23.01', '24.01', '25.01', '26.01', '27.01', '28.01', '29.01', '30.01', '31.01'],
        axisLine: {
            lineStyle: {
                color: '#EAF0F4'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#EAF0F4'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: '#EAF0F4'
            }
        },
        splitLine: {
            lineStyle: {
                color: '#EAF0F4'
            }
        }
    },
    series: [
        {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            data: [0, 120, 300, 150, 350, 100, 182, 50, 350, 20, 250, 0],
            type: 'line',
            itemStyle: {
                normal: {
                    color: 'rgb(69, 140, 201)'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(69, 140, 201, 0.7)'
                    }, {
                        offset: 1,
                        color: 'rgba(255, 255, 255, 0)'
                    }])
                }
            },
        }
    ]
};

}
