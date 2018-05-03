import { Component, OnInit } from '@angular/core';

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
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320, 1400, 1280, 987, 1450, 1290],
        type: 'line',
        itemStyle: {
                normal: {
                    color: 'rgb(69, 140, 201)'
                }
            },
        areaStyle: {
            normal: {
                    color: 'rgb(69, 140, 201, 0.5)'
            }
        }
        }
    ]
};

}
