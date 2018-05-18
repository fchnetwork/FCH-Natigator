import { Component, OnInit, ElementRef, ViewChild, TemplateRef, ViewContainerRef, Inject } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service'; 
import { AerumStatsService } from '@app/core/stats/aerum-stats-service/aerum-stats.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})

export class TestPageComponent {

  blockData: any;
  chartData: any;


  blockPropagationChart = [];
  blockPropagationAvg = 0;

  private d3: D3;
  private parentNativeElement: any;
  element: any;

  // @ViewChild("tpl") tpl: TemplateRef<any>;
  @ViewChild('tpl', { read: ViewContainerRef }) tpl: ViewContainerRef;


  constructor(@Inject(ElementRef) element: ElementRef, d3Service: D3Service, private _statSrv: AerumStatsService) {
    this.element = element.nativeElement.innerHTML;
    this.d3 = d3Service.getD3(); // <-- obtain the d3 object from the D3 Service
    this.parentNativeElement = element.nativeElement;

    _statSrv.aerumStats.subscribe(chartData => {

      if (chartData.action == "block") {
        this.blockData = chartData.data.block;
        // console.log(chartData.data.block);
      }

      if (chartData.action == "charts") {
        this.chartData = chartData.data;
        this.blockPropagationChart = this.chartData.propagation.histogram;
        this.blockPropagationAvg = this.chartData.propagation.avg;
        console.log(this.chartData.propagation.histogram);
        this.histogram(this.blockPropagationChart)
      }
      //  console.log("Response from websocket: " + JSON.stringify(msg) );
    });
  }

  histogram(data) {


    let d3 = this.d3;

    let margin = { top: 0, right: 0, bottom: 0, left: 0 };

    this.element = "";

    let width = 500,
      height = 500;


    let TICKS = 40;



    let x = d3.scaleLinear()
      .domain([0, 10000])
      .rangeRound([0, width])
      .interpolate(d3.interpolateRound);

    let y = d3.scaleLinear()
      .range([height, 0])
      .interpolate(d3.interpolateRound);

    let color = d3.scaleLinear()
      .domain([1000, 3000, 7000, 10000])
      .range(<any>["#7bcc3a", "#FFD162", "#ff8a00", "#F74B4B"]);

    let xAxis = d3.axisBottom(x)
      .ticks(4, ",.1s")
      .tickFormat((t: any) => { return t / 1000 + "s" });

    let yAxis = d3.axisLeft(y)
      .ticks(3)
      .tickFormat(d3.format("%"));

    let line = d3.line()
      .x((d: any) => { return x(d.x + d.dx / 2) - 1; })
      .y((d: any) => { return y(d.y) - 2; })
    //.curve(d3.curveCatmullRom.alpha(1));

    d3.select(".d3-blockpropagation svg").remove()

    let svg = d3.select(".d3-blockpropagation").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("y", 6);

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis);

    let bar = svg.append("g")
      .attr("class", "bars")
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", (d: any) => { return "translate(" + x(d.x) + ",0)"; })

    bar.insert("rect")
      .attr("class", "handle")
      .attr("y", 0)
      .attr("width", x(data[0].dx + data[0].x) - x(data[0].x))
      .attr("height", (d: any) => { return height; });

    bar.insert("rect")
      .attr("class", "bar")
      .attr("y", (d: any) => { return y(d.y); })
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("fill", (d: any) => { return color(d.x); })
      .attr("width", x(data[0].dx + data[0].x) - x(data[0].x) - 1)
      .attr("height", (d: any) => { return height - y(d.y) + 1; });

    bar.insert("rect")
      .attr("class", "highlight")
      .attr("y", (d: any) => { return y(d.y); })
      .attr("fill", (d: any) => { return d3.rgb(<any>color(d.x)).brighter(.7).toString(); })
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("width", x(data[0].dx + data[0].x) - x(data[0].x) - 1)
      .attr("height", (d: any) => { return height - y(d.y) + 1; });

    svg.append("path")
      .attr("class", "line")
      .attr("d", line(data));

  } 
} 