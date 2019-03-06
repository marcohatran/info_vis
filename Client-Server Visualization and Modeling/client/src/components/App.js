import React, { Component } from "react";
import * as d3 from "d3";
import $ from 'jquery';

import "./App.css";

import ClientService from "../services/ClientService";
let clientService = ClientService.getInstance();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preprocessing: "standardization",
      c: 1.0,
      data: []
    }
  }

  onPlotClicked = async () => {
    console.log(this.state);
    let data = await clientService.plot(this.state.preprocessing, this.state.c);
    this.setState({
      data: await data
    });
    this.drawChart();
  }

  onCChanged = (e) => {
    this.setState({
      c: e.target.value
    });
    console.log(e.target.value);
  }

  onPreprocessingChanged = (e) => {
    this.setState({
      preprocessing: e.target.value
    });
    console.log(e.target.value);
  }

  drawChart = () => {
    $("svg").remove();
    console.log(this.state.data);
    var margin = { top: 50, right: 50, bottom: 50, left: 50 }, 
        width = 800 - margin.left - margin.right, // Use the window's width 
        height = 600 - margin.top - margin.bottom; // Use the window's height

    // X scale will use the index of our data
    var xScale = d3.scaleLinear()
      .domain([0, 1]) // input
      .range([0, width]); // output

    // Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
      .domain([0, 1]) // input 
      .range([height, 0]); // output 

    // d3's line generator
    var line = d3.line()
      .x(function (d) { return xScale(d.fpr); }) // set the x values for the line generator
      .y(function (d) { return yScale(d.tpr); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line
    
    // Add the SVG to the page and employ #2
    const svg = d3.select("body").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom).append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Call the x axis in a group tag
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // Call the y axis in a group tag
    svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    svg.append("path")
       .data([this.state.data])
       .attr("class", "line")
       .attr("d", line);
    
    // Add title
    svg.append("text")
       .attr("transform",
             "translate(" + (width / 2) + " ," + 0 + ")")
       .attr("text-anchor", "middle")
       .text("ROC Curve");

    // Add the text label for the x axis
    svg.append("text")
       .attr("transform",
             "translate(" + (width / 2) + " ," + (height + margin.bottom - 15) + ")")
       .attr("text-anchor", "middle")
       .text("False positive rate");
    
    // Add the text label for the y axis
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 15)
       .attr("x", 0 - (height / 2))
       .attr("text-anchor", "middle")
       .text("True positive rate");
  }

  render() {
    return (
      <div className="container-fluid">
        <h1>Client-Server Visualization and Modeling</h1>
        <div className="row">
          <div className="col">
            <div className="form-group row">
              <legend className="col-form-label col-sm-2 pt-0">Preprocessing</legend>
              <div className="col-sm-10">
                <div className="form-check">
                  <input onChange={this.onPreprocessingChanged} className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="standardization" checked={this.state.preprocessing === "standardization"} />
                  <label className="form-check-label" htmlFor="gridRadios1">
                    Standardization
                  </label>
                </div>
                <div className="form-check">
                  <input onChange={this.onPreprocessingChanged} className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="min-max-scaling" />
                  <label className="form-check-label" htmlFor="gridRadios2">
                    Min-max scaling
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputC" className="col-sm-2 col-form-label">C</label>
              <div className="col-sm-10">
                <input onChange={this.onCChanged} type="text" className="form-control" id="inputC" placeholder="1.0" />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-10">
                <button onClick={this.onPlotClicked} className="btn btn-primary">Plot ROC Curve</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}

export default App;