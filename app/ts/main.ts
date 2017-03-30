import { author } from './author';

import * as d3 from 'd3';

var googleDocData; // Google spreadsheet data
var techData: Array<techNode> = []; // simplified list from google docs data

interface techNode {
    description: string;
    name: string;
    status: string;
    area: string;
    coords: Array<number>
}

var adoptLength: number = 0;
var trialLength: number = 0;
var assessLength: number = 0;
var holdLength: number = 0;
var dropLength: number = 0;


var adoptIndex: number = 1;
var trialIndex: number = 1;
var assessIndex: number = 1;
var holdIndex: number = 1;
var dropIndex: number = 1;

$.getJSON('https://spreadsheets.google.com/feeds/list/1F4FFmFjuyOtW7E2GUrwj4lbSTV5pyUTAQgTH1AZHmIs/1/public/full?alt=json', function(data) {
    //first row 'title' column
    googleDocData = data.feed.entry;

    for (let i = 0; i < googleDocData.length; i++) {
        switch (googleDocData[i].gsx$status.$t) {
            case 'Adopt':
                console.log('adoptLength', adoptLength++);
                break;
            case 'Trial':
                console.log('trialLength', trialLength++);
                break;
            case 'Assess':
                console.log('assessLength', assessLength++);
                break;
            case 'Hold':
                console.log('holdLength', holdLength++);
                break;
            case 'Drop':
                console.log('dropLength', dropLength++);
                break;
        }
    }
    
    for (let i = 0; i < googleDocData.length; i++) {

        let coords = buildCoords(googleDocData[i].gsx$status.$t, googleDocData[i].gsx$area.$t);
        // create a new object for each 
        let obj: techNode = {
            description: googleDocData[i].gsx$description.$t,
            name: googleDocData[i].gsx$technologyname.$t,
            status: googleDocData[i].gsx$status.$t,
            area: googleDocData[i].gsx$area.$t,
            coords: coords
        }

        techData.push(obj);
    }

    startApp();
});

function startApp() {
    // here we go...
    setUpSVG();   
    addDataPoints();
    createList();
}

function createList() {

    let techList = d3.select('#techList').append('ul');

    let techItem = techList.selectAll('li')
                .data(techData);
    
    let techItemEnter = techItem.enter();


    techItemEnter.append('li')
            .classed('tech-item', true)
            .text(function (node) {
                // console.log(node);
                return  node.name; 
            });
}

function setUpSVG() {

    d3.select('#radar').append('svg')
                    .attr('width', '1000')
                    .attr('height', '1000')
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 1000 1000")
                    //class to make it responsive
                    .classed("svg-content-responsive", true)
                    .append('circle')
                    .attr('cx', '50%')
                    .attr('cy', '50%')
                    .attr('r', '500')
                    .style('fill', 'rgba(255,255,255,1)')
                    .text('Drop');

    var svg = d3.select('svg');

    svg.append('circle')
                    .attr('cx', '50%')
                    .attr('cy', '50%')
                    .attr('r', '400')
                    .style('fill', 'rgba(30,30,30,0.2)')
                    .text('Hold');

    svg.append('circle')
                    .attr('cx', '50%')
                    .attr('cy', '50%')
                    .attr('r', '300')
                    .style('fill', 'rgba(30,30,30,0.2)')
                    .text('Assess');

    svg.append('circle')
                    .attr('cx', '50%')
                    .attr('cy', '50%')
                    .attr('r', '200')
                    .style('fill', 'rgba(30,30,30,0.2)')
                    .text('Trial');
    
    svg.append('circle')
                    .attr('cx', '50%')
                    .attr('cy', '50%')
                    .attr('r', '100')
                    .style('fill', 'rgba(30,30,30,0.2)')
                    .text('Adopt');


    svg.append('g').attr('transform', 'translate(500,500)'); // set the zero point to the middle of radar

    // TODO: Add paths and text for Bands.

}

function addDataPoints() {
    var group = d3.select('g');

    var dot = group.selectAll('circle')
                .data(techData);

    var dotEnter = dot.enter()
                .append('a')
                .on('mouseover', function(d, i) {
                    d3.select(this).selectAll('.node-name').style("opacity", 1)
                })
                .on('mouseleave', function(d, i) {
                    d3.select(this).selectAll('.node-name').style("opacity", 0)
                });
                    
                    
    dotEnter.append('circle')
                .style('fill', function() {
                    // return 'hsl(' + Math.random() * 360 + ',100%,50%)';
                    return 'hsl(' + 0.2 * 360 + ',100%,50%)';
                })
                .attr('cx',  function (node) {
                    return node.coords[0]; 
                })
                .attr('cy',  function (node) {
                    return node.coords[1]; 
                })
                .attr('r', '5px');

           

    var label = group.selectAll('text')
                .data(techData);

    var labelEnter = label.enter().append('g'); 
                    
            
    // labelEnter.append('rect')
    //         .attr('width', 100)
    //         .attr('height', 24)
    //         .attr('x',  function (node) {
    //             return node.coords[0] + 10 - 3; 
    //         })
    //         .attr('y',  function (node) {
    //             return node.coords[1] + 10 - 18; 
    //         })
    //         .attr('fill','white');

    labelEnter.append('text')
            .attr('x',  function (node) {
                return node.coords[0] + 10; 
            })
            .attr('y',  function (node) {
                return node.coords[1] + 10; 
            })
            .text(function (node) {
                // console.log(node);
                return  node.name; 
            });

    //    labelEnter.append('text')
    //             .attr('x',  function (node) {
    //                 return node.coords[0] + 10; 
    //             })
    //             .attr('y',  function (node) {
    //                 return node.coords[1] + 30; 
    //             })
    //             .text(function (node) {
    //                 // console.log(node);
    //                 return  node.status; 
    //             })
}

function buildCoords(status: string, area: string) {
    let statusIndex = 0;
    let statusLength = 0;

    // this should set the coords of the element based on the area and status
    const statusMap = {
        'Adopt': [0, 100], 
        'Assess': [200, 300], 
        'Trial': [100, 200], 
        'Hold': [300, 400], 
        'Drop': [400, 500]
    };
    // const areaMap = ['Tool', 'Languages and Frameworks', 'Platforms', 'Techniques'];
    const areaMap = {
        'Tool': [0, 90], 
        'Languages and Frameworks': [90, 180], 
        'Platforms': [180,270], 
        'Techniques': [270,360]
    };


    switch (status) {
        case 'Adopt':
            statusIndex = adoptIndex;
            statusLength = adoptLength;
            adoptIndex++
            break;
        case 'Trial':
            console.log('trialLength', trialLength++);
            statusIndex = trialIndex;
            statusLength = trialLength;
            trialIndex++
            break;
        case 'Assess':
            console.log('assessLength', assessLength++);
            statusIndex = assessIndex;
            statusLength = assessLength;
            assessIndex++;
            break;
        case 'Hold':
            console.log('holdLength', holdLength++);
            statusIndex = holdIndex;
            statusLength = holdLength;
            holdIndex++;
            break;
        case 'Drop':
            console.log('dropLength', dropLength++);
            statusIndex = dropIndex;
            statusLength = dropLength;
            dropIndex++
            break;
    }

    let radial = statusMap[status][0] + 50; 
    
    var theta = (360/statusLength) * statusIndex;

    // debugger;
    var radius = radial;
    var centerX = 0;
    var centerY = 0;
    var x = centerX + radius * Math.cos(theta);
    var y = centerY - radius * Math.sin(theta);

    return [x,y];
}