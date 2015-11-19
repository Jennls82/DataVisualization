	 $(document).ready(function(){
				var funnel;
				
				pieChart();
				
				$.getJSON('./stats.json')//funnelChart
					.success(function(result){funnel=funnelChart(result)})
					.error(function(error){console.log(error)});
					
				lineChart();
				
				map();
				
				$("#map").hide();
	 			$("#accordion").hide();
				$("#tables").hide(); 
				 
    			$("#stats").click(function(){
       			$("#accordion").show();

				$("#map").hide();
				$("#tables").hide();
    			});
				
				$("#worldMap").click(function(){
				$("#accordion").hide();
				$("#tables").hide();
       			$("#map").show();
    			});
				
				$("#table").click(function(){
				$("#accordion").hide();
       			$("#map").hide();
    			$("#tables").show();
				});
				
				
				
	   		 	$("#close").click(function(){
	     		$("#accordion").hide();
     			});
				 
				$("#accordion").accordion({
					heightStyle:"content",
					activate: function(event,ui) {
						funnel.replot();
					}
				});
				$("#date").datepicker();
				
				$("input[type=button]").button();
				$("tbody").sortable();
				$("th").sortable();
				 			

			});
						
function lineChart(){ 
				var men = [[1900,19], [1910,37], [1920,50], [1930,53], [1940,68],[1950, 73],[1960, 217], [1970,620], [1980,811], [1990,782], [2000,498], [2010,119]];
				var women = [[1900,13], [1910, 13], [1920,13], [1930,10], [1940,9], [1950,12], [1960,18], [1970,36], [1980,61], [1990,59], [2000,47], [2010,7]];
				var options = {
					seriesColors:['purple','chartreuse'],
					axes:{
						yaxis:{
							label: "Number of Kills",
							},
						xaxis:{
							label: "Decade",
							},				
					},
					
					title: 'Purple = men, Green = women',
						seriesDefaults:{
							showMarker: false,
							rendererOptions:{
								smooth: true
							},
							fill : true
						}
				};
					$.jqplot('chart',[men, women], options);

				};
			
				
				function pieChart(){
				var methodData = [['bomb',3],['Strangle/Gun',4],['Strangle/Bludgeon',8],['Strangle',52],['Strangle/Stab',12],['Stab/Gun',20],['Stab/Bludgeon',10],['Stab',28],['Gun',63],['Bludgeon/Gun',7],['Bludgeon',12],['Poison',2]];	
				var options = {
					seriesColors:['purple','magenta', 'violet', 'turquoise', 'pink', 'chartreuse', 'indigo', 'slateblue', 'grey', 'green', 'yellow', 'blue'],
					height:450,
					seriesDefaults: {
						renderer: jQuery.jqplot.PieRenderer,
							rendererOptions :{
								showDataLabels: true
							},
					},
							legend:{
								textColor:'red',
							location: 'ne',
							yoffset:2,
							show: true
						
					}
				};
					$.jqplot('pieChart',[methodData], options);
				};	
				
				function funnelChart(data,textStatus,jqXHR){
					var options = {
						seriesColors:['turquoise', 'chartreuse', 'indigo', 'violet', 'pink'],
						height:400,
						seriesDefaults:{
							renderer: $.jqplot.FunnelRenderer
						},
						legend:{
							location: 'e',
							show: true
						}
					};
					var funnelPlot = $.jqplot('funnelChart', [data.data], options);
				return funnelPlot;
				};
				



				
// $("#num").click(function(Id, colNo) {
// 	var zTemp =[];
// 	var rows = document.getElementById("total").getElementsByTagName('tbody')[0].getElementsByTagName('tr');
	
// 	 for(ix=0;ix<rows.length;ix++){
// 	var column = rows[ix].getElementsByTagName('td')[colNo - 1]; 
// 	zTemp[ix] = []; 
// 	  zTemp[ix][0] = column.innerHTML;                        
//     zTemp[ix][1] = rows[ix]; 
// 	}
// 	  zTemp.sort(function (){
// 		  for (var z =0; z < zTemp.length; )
//                     if (z === zTemp[]){
// 						 return 0;
// 						 }
// 						 else{
//                     return (z < zTemp[] ? -1 : 1;
// 						 }
//                   }
//   );
//   for(ix=0;ix<rows.length;ix++){                                
//     var temp = rows[ix].parentNode;   
//     temp.removeChild(rows[ix]);
//   }
//   var tBody = document.getElementById(id).getElementsByTagName('tbody')[0];
//   for(ix=0;ix<zTemp.length;ix++){                            
//     tBody.appendChild(zTemp[ix][1]);
//   }
//  });
	
function map(){
		//Width and height
			var w = 600;
			var h = 500;
			var total =  0;
			var empty="No report available";
			//Define map projection
			var projection = d3.geo.mercator()
								   .translate([w/2, h/2])
								   .scale([100]);
			//Define path generator
			var path = d3.geo.path()
							 .projection(projection);
							 
			//Define quantize scale to sort data values into buckets of color
			 var color = d3.scale.quantize()
							.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,46)"]);
								//Colors taken from colorbrewer.js, included in the D3 download

			//Create SVG element
			var svg = d3.select("#map")
						.append("svg")
						.attr("width", w)
						.attr("height", h);
			//Load in data
			d3.csv("geo.csv", function(data) {
				 //Set input domain for color scale
				 color.domain([
				 	d3.min(data, function(d) { return d.value; }), 
				 	120//d3.max(data, function(d) { return d.value; })
				 ]);
				 
				//Load in GeoJSON data
				d3.json("countries-hires.json", function(json) {

					//Merge the data and GeoJSON
					//Loop through once for each ag. data value
					 for (var i = 0; i < data.length; i++) {
				
					 	//Grab country
					 	var dataCountry = data[i].country;
						
					 	//Grab data value, and convert from string to float
					 	var dataValue = parseFloat(data[i].value);
						total += dataValue;
						//Find the corresponding country inside the GeoJSON
						for (var j = 0; j < json.features.length; j++) {
						
							var jsonCountry = json.features[j].properties.NAME;
				
							if (dataCountry == jsonCountry) {
						
								//Copy the data value into the JSON
								json.features[j].properties.value = dataValue;
								
								//Stop looking through the JSON
								break;
								
							}
						}		
					}

					//Bind data and create one path per GeoJSON feature
					svg.selectAll("path")
					   .data(json.features)
					   .enter()
					   .append("path")
					   .attr("d", path)
					   .style("fill", function(d) {
					   		//Get data value
					   	   var value = d.properties.value;		   
					   		if (value) {
					   		//If value exists…
						   	return color(value);
					   		 } else {
					   			//If value is undefined…
						   		return "rgb(243, 228, 239)";
					   		}
							 
					   });
			//display the numbers for each country		
			var tooltip = d3.select("#map")
			    .append('div')                             
  				.attr('class', 'tooltip');                 

				tooltip.append('div')                        
  				.attr('class', 'name');                   

				tooltip.append('div')                        
  				.attr('class', 'count');                   

				tooltip.append('div')                       
  				.attr('class', 'percent');  
			
			svg.selectAll("path").on('mouseover', function(d) {                                                                                                                   
            var percent = Math.round(1000 * d.properties.value / total) / 10; 
            tooltip.select('.name').html(d.properties.NAME);    
			if (d.properties.value == null || ".percent" == NaN){            
            	tooltip.select('.count').html("");                
            	tooltip.select('.percent').html(""); 
			}else{
	        	tooltip.select('.count').html(d.properties.value);                
            	tooltip.select('.percent').html(percent + '%'); 
			}                      
			tooltip.style('display', 'block');   
          });                                                           
          
          svg.selectAll("path").on('mouseout', function() {                              
            tooltip.style('display', 'none');                           
          }); 
		  
		 svg.selectAll("path").on('mousemove', function(d) {
 		 tooltip.style('top', (d3.event.pageY + 10) + 'px') ; 
         tooltip.style('left', (d3.event.pageX + 10) + 'px'); 
		});
					   
				 })		
			
			});
	};