const padding = 2;

const margin = { top: 10, right: 5, bottom: 10, left: 5 };
const width = d3.select('.chart').node().getBoundingClientRect().width;
const height = d3.select('.chart').node().getBoundingClientRect().width;

// From colorbrewer Dark2 + 2
var colour = d3.scaleOrdinal()
    .range(["#5e3c99", "#e66101"]);

const tooltip = d3.select("body").append("div")
    .style("opacity", 0);

document.addEventListener("DOMContentLoaded", function(e) {

  //Chart 1: all user-led grants
  var chartsimple = function(d3) {
    //Load in grants data
    d3.json("cdll.json", function(data) {

      data.sort(function(a, b) {return d3.ascending(a.Sexe, b.Sexe);});
      data.sort(function(a, b) {return d3.descending(a.PtgDones, b.PtgDones);});

      const nest = d3
        .nest()
        .key(d => d.DonesPartit)
        .entries(data);

      grid = d3.select("#chart-colours")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("class", "column-chart")

      const group = grid.selectAll('#group')
        .data(nest)
        .enter()
        .append('div')
        .attr("id", function(d) { if (d.key == "Altres 28% dones") {
          return "grans";
        } else {
          return "group";}
        });
      console.log(nest);

      group.selectAll('.block')
        .data(d => d.values)
        .enter()
        .append('div')
        .style("width", 4 + "px")
        .style("height", 4 + "px")
        .style('background-color', function(d){
          return colour(d.Sexe);
        })
        .attr("class", "block")
        .on("mousemove", function(d) {
          d3.select(this)
            .style('opacity', 0.5);
          tooltip.transition()
            .duration(100)
            .style("opacity", .9)
            .attr("class", "tooltip")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY + 5) + "px");
          tooltip.html("Cap de llista:</br><b>" + d.CapDeLlista + "</b></br>" + d.Candidatura + "</br>Municipi: " + d.Municipi +
                "</br>Habitants: " + d.NHabitants);
          })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("opacity", 1);
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
          });

      group.append('div')
          .style("width", "500px");

      group.append('text')
          .attr("class", "labels")
          .text(d => d.key);

      legendValues = d3.set(data.map( function(d) { return d.Sexe } ) ).values()

      var legend = d3.select(".legend")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr("class", "legend-flex")
          .selectAll(".legends")
          .data(legendValues)
          .enter()
          .append("rect")
          .attr("class", "legends")
          .style("background-color", function (d) { return colour(d) })
          .append('text')
          .text(function (d, i) { return d })
          .attr("class", "legend-text")

  });

}(d3);

});
