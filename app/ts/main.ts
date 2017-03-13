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

d3.selectAll('p').style('color', function() {
  return 'hsl(' + Math.random() * 360 + ',100%,50%)';
});

$.getJSON('https://spreadsheets.google.com/feeds/list/1F4FFmFjuyOtW7E2GUrwj4lbSTV5pyUTAQgTH1AZHmIs/od6/public/values?alt=json', function(data) {
    //first row 'title' column
    googleDocData = data.feed.entry;
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
}

function setUpSVG() {


    d3.select('body').append('svg')
                    .attr('width', '1000')
                    .attr('height', '1000')
                    .attr('preserveAspectRatio', 'xMaxYMax meet')
                    .append('circle')
                    .attr('cx', '50%')
                    .attr('cy', '50%')
                    .attr('r', '500')
                    .style('fill', 'rgba(30,30,30,0.2)')
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



    var group = d3.select('g');

    var nodes = group.selectAll('circle')
                .data(techData)
                .enter()
                .append('circle')
                .attr('cx',  function (node) {
                    return node.coords[0]; 
                })
                .attr('cy', '0')
                .attr('r', '1%')
                .style('fill', function() {
                    // return 'hsl(' + Math.random() * 360 + ',100%,50%)';
                    return 'hsl(' + 0.2 * 360 + ',100%,50%)';
                })
                .text(function (node) {
                    // console.log(node);
                    return node.name; 
                });

    console.log(nodes.data());
}

function buildCoords(status: string, area: string) {
    // this should set the coords of the element based on the area and status
    const statusMap = ['Hold', 'Trial', 'Assess', 'Adopt', 'Drop'];
    // const areaMap = ['Tool', 'Languages and Frameworks', 'Platforms', 'Techniques'];
    const areaMap = {
        'Tool': [0, 90], 
        'Languages and Frameworks': [90, 180], 
        'Platforms': [180,270], 
        'Techniques': [270,360]
    };
    

    let radial = (statusMap.indexOf(status) * 100); 
    let quadrant = areaMap[area];



    console.log('quadrant: ', quadrant);
    console.log('radial: ', radial);

    // return [radial, quadrant];
    return [radial,1];
}