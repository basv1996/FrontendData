
  const margin = {top: 40, bottom: 10, left: 120, right: 20};
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Creates sources <svg> element
  const svg = d3.select('body').append('svg')
              .attr('width', width+margin.left+margin.right)
              .attr('height', height+margin.top+margin.bottom);

  // Group used to enforce margin
  const g = svg.append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`);

  // Global variable for all data
  //const data = [66.38, 21.51, 23.37, 34.17, 36.21];
  let data;

  const bar_height = 50;

  /////////////////////////
  // TODO create a nested title element that shows the value as tooltip


  // Render the chart with new data
  d3.json('https://rawgit.com/sgratzl/d3tutorial/master/examples/weather.json').then((json) =>{
      data = json;

      updateMe(data);
  });

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

  // ENTER + UPDATE
  // both old and new elements
  rect
    .attr('height', bar_height)
    .attr('width', (d) => d.temperature * 7)
    .attr('y', (d, i) => i*(bar_height+5));

    rect.select('title').text((d)=> d.location.city)
  }