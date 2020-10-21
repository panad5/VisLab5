//CHART INIT
let outerWidth = 700;
let outerHeight = 500;
let margin = {top:40, right:40, bottom: 40, left: 40}; //create margin between axis and outside of chart
let width = outerWidth - margin.left - margin.right, height = outerHeight - margin.top - margin.bottom;
let svg = d3.select('.coffeehouse-plot').append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);      

const yScale = d3.scaleLinear()
    .range([height, 0]); //height goes first because the browser considers origin (0,0) to be upper left corner

svg.append("g") //container for axis
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`)   //translates axis to bottom

svg.append("g")
.attr("class", "axis y-axis")

xLabel = svg.append("text")
    .attr("class", "xaxis")
    .attr('x', width-40)
    .attr('y', height + 35)
    .text("Company")

    yLabel = svg.append("text")
    .attr("class", "yaxis")
    .attr('x', 0)
    .attr('y', -5)
    .text("Stores")  

    let order = 0
    let type = 'stores'

//CHART UPDATE FUNCTION implement the enter-update-exist sequence, update axes and axis title

function update(data, type, order){

type = document.querySelector("#group-by").value
order = document.querySelector("#sort").value
console.log(order);
if (order == 'ascending'){
data = data.sort(function(a,b){
    return a[type] - b[type]
});
}
if (order == 'descending'){
    data = data.sort(function(a,b){
    return b[type] - a[type]
    });
}

 // Update scale domains
 let max = d3.max(data,d=>d[type])
	xScale.domain(data.map(d=>d.company))
    yScale.domain([0, max])

console.log(type);

yLabel.text(function(){
if (type == 'stores')
    return 'Stores'

if (type == 'revenue')
    return 'Billion USD'
})

    let rect = svg.selectAll('rect') //save the update selection in a variable, can access enter selection from update selection
    .data(data);
    rect.enter()
    .append('rect')
    .attr('fill', 'teal')
    .merge(rect) //combine enter selection and update selection and updating properties at the same time 
    .transition()
    .duration(1000)
    .delay(function(d, i) {return (i*10)})    
    .attr('x', d=>xScale(d.company))
    .attr('y', d=>yScale(d[type]))
    .attr('width', 70)
    .attr('height', d=> height - yScale(d[type]))
    rect.exit().remove() //remove exit selection

    //update axes
    let xAxis = d3.axisBottom(xScale);
    svg.select('.x-axis')
    .transition()
    .duration(1500)
    .call(xAxis)
    .ticks
    
    let yAxis = d3.axisLeft(yScale);
    svg.select('.y-axis')
    .transition()
    .duration(1500)
    .call(yAxis)
    .ticks;
}

//CHART UPDATES: load data, handle type and direction change
d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{

update(data, type);
document.querySelector("#group-by").addEventListener("change", function(e){
        update(data, type);
    });   
document.querySelector("#sort").addEventListener("change", function(e){
    update(data, type, order);
    });   
});

