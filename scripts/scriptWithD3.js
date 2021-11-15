// https://api.punkapi.com/v2/ 

const margin = {top: 40, bottom: 10, left: 120, right: 20};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const beer_height = 50;

 // Creates sources <svg> element
 const svg = d3.select('body').append('svg')
 .attr('width', width+margin.left+margin.right)
 .attr('height', height+margin.top+margin.bottom);

// Group used to enforce margin
  const g = svg.append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`);

d3.json('https://api.punkapi.com/v2/beers?page=2&per_page=10').then((json) => {
data = json
console.log(json)
console.log(json.Object)
console.log(json[0].name)
console.log(json.map((obj) => {
    return obj.name
}))

console.log(json.map((obj) => {
    return obj.tagline
}))

console.log(json.map((obj) => {
    return obj.abv
}))

updateMe(data)
}) 

function updateMe(new_data) {
    // DATA JOIN
  const rect = g
  .selectAll('rect')
  .data(new_data)
  .join(
     // ENTER 
     // new elements
       (enter) => {
         const rect_enter = enter.append('rect').attr('x', 0)
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
    .attr('height', beer_height)
    .attr('width', (d) => d.abv * 7)
    .attr('y', (d, i) => i*(beer_height+5));

    rect.select('title')
    .text((d) => 
    d.name)
  }

  d3.select('.more-than-x-percentage').on('change'), function() {
      // This will be triggered when the user selects or unselects the checkbox
  const checked = d3.select(this).property('checked');
  if (checked === true) {
    // Checkbox was just checked
    console.log("checked")
  }



