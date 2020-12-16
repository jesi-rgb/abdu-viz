import React, { Component } from 'react'
import * as d3 from 'd3'
import * as _ from 'lodash'

class BarChart extends Component {

    constructor(props){
        super(props);
        this.chartRef = React.createRef();
        this.bubblesRef = React.createRef();
    }

    componentDidMount(){
        // let accessToRef = d3.select(this.myRef.current);
        // accessToRef.style("background-color", "blue");
        this.drawChart()
    }

    render(){
        return <>
        <div ref={this.chartRef}></div>
        <div ref={this.bubblesRef}></div>
        </>
    }

    drawChart(){
        const margin = {top: 30, right: 30, bottom: 100, left: 60},
        width = 460 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
        
        const barchartCanvas = d3.select(this.chartRef.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");


        const bubblesCanvas = d3.select(this.bubblesRef.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

        d3.csv(`${process.env.PUBLIC_URL}/data/spoty_short.csv`, (data) => {

                // GENRE barchartCanvas //
                const g_groups = _.countBy(data, "genre");

                const data_group = Object.keys(g_groups).map(group => {
                    const aux = {};
                    aux.genre = group;
                    aux.count = g_groups[group];
                    return aux;
                });

                const sorted = _.sortBy(data_group, "count");

                const xGenre = d3.scaleBand()
                    .range([0, width])
                    .domain(_.map(sorted, d => { return d.genre; }))
                    .padding(0.2);


                barchartCanvas.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(xGenre))
                    .selectAll("text")
                    .attr("transform", "translate(-13,10)rotate(-90)")
                    .style("text-anchor", "end");


                const yGenre = d3.scaleLinear()
                    .domain([0, d3.max(_.map(data_group, d => d.count))])
                    .range([height, 0]);

                const scaleColorG = d3.scaleLinear()
                    .domain([0, d3.max(_.map(data_group, d => d.count))])
                    .range(["#C3F0FF", "#9AE6FF", "#A6DAFF"]);


                barchartCanvas.append("g")
                    .attr("class", "leftAxis")
                    .call(d3.axisLeft(yGenre))
                    .style("color", "white");



                barchartCanvas.selectAll("mybar")
                    .data(sorted)
                    .enter()
                    .append("rect")
                    .attr("x", (d) => { return xGenre(d.genre); })
                    .attr("y", (d) => { return yGenre(d.count); })
                    .attr("width", xGenre.bandwidth())
                    .attr("height", (d) => { return height - yGenre(d.count); })
                    .attr("fill", (d) => { return scaleColorG(d.count); });

            
                //BUBBLES
                const props = data.map(d => {
                    const aux = {};
                    aux.genre = d.genre;
                    aux.loudness = +d.loudness;
                    aux.duration_ms = +d.duration_ms;
                    return aux;
                })
            
            
                const xAvgDuration = d3.scaleBand()
                                    .domain(props.map(d => d.genre))
                                    .range([0, width])
                                    .padding(1);
            
                
                bubblesCanvas.append("g")
                                .attr("transform", "translate(" + 0 + "," + height + ")")
                                .call(d3.axisBottom(xAvgDuration))
                                .selectAll("text")
                                .attr("transform", "translate(-13,10)rotate(-90)")
                                .style("text-anchor", "end");
            
                
            
                const yAvgDuration = d3.scaleLinear()
                                    .domain([d3.min(props.map(d => d.loudness)), 0])
                                    .range([height, 0]);
            
                bubblesCanvas.append("g")
                                .call(d3.axisLeft(yAvgDuration));
            
                
                
                const sizeAvgDuration = d3.scaleLinear()
                                        .domain([0, d3.max(props.map(d => d.duration_ms))])
                                        .range([3, 20])
            
                const alphaScaler = d3.scaleLinear()
                                    .domain([0, d3.max(props.map(d => d.duration_ms))])
                                    .range([0, 0.75])
            
            
                bubblesCanvas.selectAll("circles")
                                .data(props)
                                .enter()
                                .append("circle")
                                .attr("cx", (d) => {return xAvgDuration(d.genre);})
                                .attr("cy", (d) => {return yAvgDuration(d.loudness);})
                                .attr('r', (d) => {return sizeAvgDuration(d.duration_ms);}) // 
                                .attr("fill", "#BC96E6")
                                .attr('opacity', d => {return alphaScaler(d.duration_ms);})
                            // .attr('stroke', "black")
            
            
            })


            

    }
    
}
export default BarChart;