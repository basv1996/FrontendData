// https://api.punkapi.com/v2/ 

// https://pokeapi.co/api/v2/pokemon?limit=100&offset=0

const margin = {top: 40, bottom: 140, left: 150, right: 20};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

 // Creates sources <svg> element
 const svg = d3.select('body').append('svg')
 .attr('width', width+margin.left+margin.right)
 .attr('height', height+margin.top+margin.bottom)

// Group used to enforce margin
  const g = svg.append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`)
              // transformeer de getekende chart en verplaats hem x stappen van links en x stappen van de top (in dit geval 150 en 40)

const xScale = d3.scaleBand()
.range([ 0, width ])
.domain([0, width])
.padding(0.2); 


//maak een scale met een domein van 0 tot 10 (10 stappen op een range van ...) en een range van 0 tot 100. 
//In dit geval zou een range van 5 een output geven van 50


const yScale = d3.scaleLinear()
//.domain([0, height])
.range([ height, 0])


const xaxis = d3.axisBottom().scale(xScale) // De cijfers worden aan de bovenkant van de x-as geplaatst
const drawXaxis = g.append('g').attr("class", "x-as") // teken een x as

const yaxis = d3.axisLeft().scale(yScale)
const drawYaxis = g.append('g').attr("class", "y-as") //teken een y as

d3.json('https://api.punkapi.com/v2/beers?page=1&per_page=11').then((json) => {
data = json

updateMe(data)
}) 

function updateMe(new_data) {

     // update de schalen
  yScale
  .domain([0, d3.max(new_data, (d) => 
    d.abv)])

  xScale
  .domain(new_data.map((d) =>
   d.name))

   //maak de assen
  drawXaxis
  .attr('transform', 'translate(0,' + height + ')')
  .transition()
  .call(xaxis)
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end")
  .attr("font-size", "16")

  drawYaxis
  .transition()
  .call(yaxis)

    // DATA JOIN
    //const makeItAlink = rect
  const rect = g
  .selectAll('rect')
  .data(new_data)
  .join(
     // ENTER 
     // new elements
       (enter) => {
         const rect_enter = 
         enter.append('rect').attr('x', 0)
         rect_enter.append('title')
          return rect_enter
    },
    // UPDATE
    // update existing elements
    (update) => update,
    // EXIT
    // elements that aren't associated with data
    (exit) => exit.remove()
    )

    rect
    .transition()
    .ease(d3.easeBounceOut)
    .duration(1000)
    .attr("x", (d) => xScale(d.name))
    .attr("y", (d) => yScale(d.abv))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height -yScale(d.abv))
    
    
    rect.select('title')
    .text((d) => 
   d.name + ": " + d.abv)
   
   //geef de rectangles een title van de naam van het biertje en het alcohol permilage

   rect.on('click', (e) =>
   window.open(e.target.childNodes[1].getAttribute('href'))
   )

   rect.append('a').attr("href", (d) => d.image_url).text((d) => d.name)

  }

  d3.select('#alcoholPercentage').on('change', 
  function() {
             const checked = d3.select(this).property('checked')  // als de gebruiker op de checkbox klikt
                if (checked == true) { // als er op de checkbox geklikt is en deze aangevinkt is
                    const high_percentage = data.filter((d) => 
                    d.abv >= 5)
                    updateMe(high_percentage)
                } else {
                     updateMe(data)
  }
})

d3.select('#alcoholPercentageMinder').on('change', 
function() {
           const checked = d3.select(this).property('checked')  // als de gebruiker op de checkbox klikt
              if (checked == true) { // als er op de checkbox geklikt is en deze aangevinkt is
                  const high_percentage = data.filter((d) => 
                  d.abv <= 5)
                  updateMe(high_percentage)
              } else {
                   updateMe(data)
}
})

d3.select('#alcoholPercentageAlles').on('change', 
function() {  
           const checked = d3.select(this).property('checked')  // als de gebruiker op de checkbox klikt
              if (checked == true) { // als er op de checkbox geklikt is en deze aangevinkt is
                  const high_percentage = data.filter((d) => 
                  d.abv >= 0)
                  updateMe(high_percentage)
              } else {
                   updateMe(data)
}
 })
