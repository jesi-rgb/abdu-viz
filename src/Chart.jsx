import React, { Component } from 'react'
import * as d3 from 'd3'
import * as _ from 'lodash'

class BarChart extends Component {

    constructor(props){
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount(){
        // let accessToRef = d3.select(this.myRef.current);
        // accessToRef.style("background-color", "blue");
        this.drawChart()
    }

    render(){
        return <>
        <div ref={this.myRef}></div>
        </>
    }

    drawChart(){
        const margin = {top: 30, right: 30, bottom: 100, left: 60},
        width = 460 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
        
        const canvas = d3.select(this.myRef.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

        d3.csv(`${process.env.PUBLIC_URL}/data/spoty_short.csv`, (data) => {

                // GENRE CANVAS //
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


                canvas.append("g")
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


                canvas.append("g")
                    .attr("class", "leftAxis")
                    .call(d3.axisLeft(yGenre))
                    .style("color", "white");



                canvas.selectAll("mybar")
                    .data(sorted)
                    .enter()
                    .append("rect")
                    .attr("x", (d) => { return xGenre(d.genre); })
                    .attr("y", (d) => { return yGenre(d.count); })
                    .attr("width", xGenre.bandwidth())
                    .attr("height", (d) => { return height - yGenre(d.count); })
                    .attr("fill", (d) => { return scaleColorG(d.count); });

            })

    }
    
}
export default BarChart;