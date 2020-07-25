const bluebird = require('bluebird');
const Redis = require('ioredis');
const redis = new Redis(); // Change server here if minions are not running on localhost
const uuid = require('uuid/v4');

const parameters = {
    baseFuel: {
        copula: 10,
        meanlog: 0.25,
        sdlog: 0.25
    },
    solarFlares: {
        fuel: {
            meanlog: 0.2,
            sdlog: 0.5
        },
        lambda: 4,
        shape: 6,
        scale: 0.75
    },
    asteroids: {
        fuel: {
            mean: 1.5,
            sd: 0.25
        },
        lambda: 0.000005
    }
};
const jobsQueue = 'jobsQueue';
const integerArrayOfLength = length => [ ...Array(length).keys() ];

// Make requests
bluebird.map(integerArrayOfLength(100), (id) => {
    // Determine unique response queue and use it to build job
    const resultsQueue = uuid();
    const job = {
        package: 'stealTheMoon',
        func: 'simulateTrip',
        parameters,
        resultsQueue,
        errorQueue: resultsQueue,
        id // Sent job will be returned as response, so add an ID to the request for future use
    };
    // Push job to queue
    redis.rpush(jobsQueue, JSON.stringify(job));
    // Perform blocking pop on result queue that will wait for a response
    return redis.brpop(resultsQueue, 0)
        .then(([key, resultJSON]) => {
            const result = JSON.parse(resultJSON);
            if(result.status !== 'succeeded') {
                console.error(result.error);
                return result.error;
            } else {
                return result.results;
            }
        });
})
    .then((results) => {
        console.log(results);
        process.exit(0);
    });