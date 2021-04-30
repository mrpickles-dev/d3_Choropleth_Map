let urlCount = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
let urlEduca = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'


let countyData 
let educationData
let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () =>  {

    canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = educationData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        if(percentage <= 15){
            return '#A7A843'
        }else if(percentage <= 30){
            return '#D1DB60'
        }else if(percentage <= 45){
            return '#E6C98A'
        }else{
            return '#EEC4AA'
        }
    })
    .attr('data-fips', (countyDataItem) => {
        return countyDataItem['id']
    })
    .attr('data-education', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = educationData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        return percentage
    })
    .on('mouseover', (countyDataItem)=> {
        tooltip.transition()
            .style('visibility', 'visible')

        let id = countyDataItem['id']
        let county = educationData.find((item) => {
            return item['fips'] === id
        })

        tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
            county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

        tooltip.attr('data-education', county['bachelorsOrHigher'] )
    })
    .on('mouseout', (countyDataItem) => {
        tooltip.transition()
            .style('visibility', 'hidden')
    })
}


d3.json(urlCount).then(
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(urlEduca).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)