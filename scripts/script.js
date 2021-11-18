// https://api.punkapi.com/v2/ 

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
.domain([0,10])
.range([ 0, width ])
.padding(0.2)

//maak een scale met een range van 0 tot 100. 


const yScale = d3.scaleLinear()
.domain([0,10])
.range([ height, 0]) //van height naar 0 zodat op de y-as de hoogte bovenaan staat


const xaxis = d3.axisBottom().scale(xScale) // De data wordt aan de onderkant van de x-as geplaatst
const drawXaxis = g.append('g').attr("class", "x-as") // teken een x as

const yaxis = d3.axisLeft().scale(yScale) // De data wordt aan de linkerkant van de as geplaatst
const drawYaxis = g.append('g').attr("class", "y-as") //teken een y as

d3.json('https://api.punkapi.com/v2/beers?page=1&per_page=11').then((json) => {
  // Verzendt http-request naar de opgegeven url om .json-bestand of gegevens te laden
data = json

updateMe(data)
}) 

function updateMe(new_data) {
     // update de schalen
  yScale.domain([0, d3.max(new_data, (d) => d.abv)])
  xScale.domain(new_data.map((d) => d.name))

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
  const rect = g
  .selectAll('rect')
  .data(new_data)
  .join(
     // ENTER 
     // nieuwe elementen
       (enter) => {
         const rect_enter = 
         enter.append('rect').attr('x', 0)
         rect_enter.append('title')
          return rect_enter
    },
    // UPDATE
    // Update de bestaande elementen
    (update) => update,
    // EXIT
    // de elementen die die niet geassocieert zijn met de data
    (exit) => exit.remove()
    )

    rect
    .transition()
    .ease(d3.easeBounceOut)
    .duration(1000)
    .attr("x", (d) => xScale(d.name))
    .attr("y", (d) => yScale(d.abv))
    .attr("width", xScale.bandwidth()) //bandwidth wordt gebruik om de bandbreedte van de X schaal te vinden
    .attr("height", (d) => height -yScale(d.abv)) // de hoogte van een rectangle(bar) is de hoogte per object min de y schaal van het alcohol percentage
    
    
    rect.select('title')
    .text((d) => 
   d.name + ": " + d.abv) //geef de rectangles een title van de naam van het biertje en het alcohol permilage
   
   rect.append('a').attr("href", (d) => d.image_url).text((d) => d.name)// voeg een a tag toe met een href met de gegevens van image_url en geef de tekst de naam

   rect.on('click', (e) =>
   window.open(e.target.childNodes[1].getAttribute('href')) // Als er geklikt wordt op de bar open dan de link binnen in de rectangle
   )
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
