// d3.json('data/samples.json').then(function(data) {
//     var metadata = data.metadata[0]
//     var names = data.names
//     var samples = data.samples
//     console.log(metadata)
//     // console.log(data)
// })

function init() {
    d3.json('data/samples.json').then(function(data) {
        //Load Data
        var metadata = data.metadata[0]
        var names = data.names[0]
        var samples = data.samples[0]

        //Add labels to OTU
        var otu_ids_new = samples.otu_ids.map(d => `OTU ${d}`)

        //Build Bar Chart
        var dataBar = [{
            y: otu_ids_new.slice(0,10).reverse(),
            x: samples.sample_values.slice(0,10).reverse(),
            text: samples.otu_labels.slice(0,10).reverse(),
            name: names,
            type: 'bar',
            orientation: "h"
        }]

        var layoutBar = {
            title: {
                text:`ID: ${names}`
            },
            xaxis: {
                title: 'Sample Values'
            },
            yaxis: {
                title: 'Sample ID'
            }
        }

        //Build Bubble Chart
        var dataBubble = [{
            x: samples.otu_ids,
            y: samples.sample_values,
            text: samples.otu_labels,
            mode: 'markers',
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            type: 'scatter'
        }]

        var layoutBubble = {
            xaxis: {
                title: 'Sample ID'
            },
            yaxis: {
                title: 'Sample Values'
            }
        }

        //Plotly
        Plotly.newPlot("bar", dataBar, layoutBar);
        // Plotly.newplot("gauge", dataGauge);
        Plotly.newPlot("bubble", dataBubble, layoutBubble);

        //Enter Basic Demographic Info
        var meta = d3.select('#sample-metadata')
        metaKeys=Object.keys(metadata)
        metaValues=Object.values(metadata)

        for (var i=0; i<metaKeys.length;i++) {
            meta.append('div').text(metaKeys[i]+ ': '+metaValues[i])
        }

        //Add list of Test IDs
        var itemList = d3.select('#selDataset')
        nameList=data.names

        for (var j=0; j<nameList.length; j++) {
            itemList.append('option').text(nameList[j]).property('value',nameList[j])
        }

    })
}



function optionChanged(N) {
    //d3.event.preventDefault();
    d3.json('data/samples.json').then(function(data) {
        // Load Data
        var metadata = data.metadata.filter(d => d.id==parseInt(N))[0]
        var names = data.names.filter(d => d===N)[0]
        var samples = data.samples.filter(d => d.id===N)[0]
        console.log(metadata)

        // Rebuild Demographics
        var meta = d3.select('#sample-metadata')
        metaKeys=Object.keys(metadata)
        metaValues=Object.values(metadata)
        meta.html("")
        for (var i=0; i<metaKeys.length;i++) {
            meta.append('div').text(metaKeys[i]+ ': '+metaValues[i])
        }


        //Rebuild Plotly Plots

        //Rebuild Bar plot
        var otu_ids_new = samples.otu_ids.map(d => `OTU ${d}`)
        var barLayoutUpdate= {
            title: {text:`ID: ${names}`}
        }
        Plotly.restyle("bar", "x", [samples.sample_values.slice(0,10).reverse()])
        Plotly.restyle("bar", "y", [otu_ids_new.slice(0,10).reverse()])
        Plotly.restyle("bar", "text", [samples.otu_labels.slice(0,10).reverse()])
        Plotly.restyle("bar", "name", [names])
        Plotly.relayout("bar", barLayoutUpdate)

        // Rebuild bubble plot

        Plotly.restyle("bubble", "x", [samples.otu_ids])
        Plotly.restyle("bubble", "y", [samples.sample_values])
        Plotly.restyle("bubble", "text", [samples.otu_labels])
        Plotly.restyle("bubble", "marker", [{size: samples.sample_values, color: samples.otu_ids}])
    })
}


init()
