// https://api.punkapi.com/v2/ 

// https://pokeapi.co/api/v2/pokemon?limit=100&offset=0

const margin = {top: 40, bottom: 10, left: 150, right: 20};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const beer_height = 50;

 // Creates sources <svg> element
 const svg = d3.select('body').append('svg')
 .attr('width', width+margin.left+margin.right)
 .attr('height', height+margin.top+margin.bottom)

// Group used to enforce margin
  const g = svg.append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`)
              // transformeer de getekende chart en verplaats hem x stappen van links en x stappen van de top (in dit geval 150 en 40)

const xScale = d3.scaleLinear()
.range([0,width]).domain([0, 20]) 
//maak een scale met een domein van 0 tot 10 (10 stappen op een range van ...) en een range van 0 tot 100. 
//In dit geval zou een range van 5 een output geven van 50


const yScale = d3.scaleBand()
.rangeRound([0, height])
.paddingInner(0.1)


const xaxis = d3.axisTop().scale(xScale)
const drawXaxis = g.append('g').attr("class", "x-as") // teken een x as

const yaxis = d3.axisLeft().scale(yScale)
const drawYaxis = g.append('g').attr("class", "y-as") //teken een y as

d3.json('https://api.punkapi.com/v2/beers?page=2&per_page=10').then((json) => {
data = json
 console.log(json)
// console.log(json.Object)
// console.log(json[0].name)
// console.log(json.map((obj) => {
//     return obj.name
// }))

// console.log(json.map((obj) => {
//     return obj.tagline
// }))

console.log(json.map((obj) => {
    return obj.abv
}))

updateMe(data)
}) 

function updateMe(new_data) {

     // update de schalen
  xScale
  .domain([0, d3.max(new_data, (d) => 
    d.abv)])

  yScale
  .domain(new_data.map((d) =>
   d.name))
   
  
  //maak de assen
  drawXaxis
  .transition()
  .call(xaxis)

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
        //  const link = enter.append('a').attr("href", (d) => d.image_url).text((d) => d.name);
        
         const rect_enter = 
         //enter.append('a').attr("href", (d) => d.image_url).text((d) => d.name)
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
    );

    rect
    .transition()
    .ease(d3.easeBounceOut)
    //.delay(1000)
    .duration(1000)
    .attr('height', yScale.bandwidth())
    .attr('width', (d) => xScale(d.abv) )
    .attr('y', (d) => yScale(d.name))

    
    rect.select('title')
    .text((d) => 
   d.name + ": " + d.abv)
   //geef de rectangles een title van de naam van het biertje en het alcohol permilage

   rect.append('a').attr("href", (d) => d.image_url).text((d) => d.name)
   //(d) => d.image_url

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
});

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
});

function clickMe() {}