function getCountries(str, p) {
    let locations = null;
    let pages = null;
    https.get(url + str, function(res) {
        //         Define placeholder variable for raw data.
        let rawData = '';
        // //         Append incoming data chunks to rawData string.
        res.on('data', (chunk) => rawData += chunk);
        // //         Parse the data after response ends.
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                //               // Assign number of territories that match the desired population count to total.
                locations = parsedData.data.map(location => ({
                    name: location.name,
                    population: location.population
                }));
                pages = parsedData.total_pages;
                const pagesLoaded = [1];
                // Iteratively fetch more pages if they exist.
                if (pages > 1) {
                    for (let i = 2; i <= pages; i++) {
                        https.get(url + str + '&page=' + i, function(res) {
                            let rawData = '';
                            res.on('data', (chunk) => rawData += chunk);
                            res.on('end', () => {
                                const parsedData = JSON.parse(rawData);
                                pagesLoaded.push(parsedData.page);
                                parsedData.data.forEach(location => {
                                    locations.push({
                                        name: location.name,
                                        population: location.population
                                    })
                                })
                                //                       If all the pages have been loaded return the number of countries found.
                                if (pagesLoaded.length === pages) {
                                    console.log(locations.filter(l => l.population > p).length)
                                }
                            })
                        })
                    }
                } else {
                    // Log number of countries found.
                    console.log(locations.filter(l => l.population > p).length)
                }
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', (e) => {
        console.log(`HTTPS Error ${e.message}`);
    });
}
