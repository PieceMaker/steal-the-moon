const _ = require('lodash');
const bluebird = require('bluebird');
const Redis = require('ioredis');
const redis = new Redis();
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

// Push 100 requests into queue
const requests = _.chain()
    .range(100)
    .map(() => {
        redis.rpush(jobsQueue, JSON.stringify(job));
        return redis.brpop(job.resultsQueue, 0)
            .then((result) => {
                result = JSON.parse(result);
                if(result.status !== 'succeeded') {
                    console.error(result.error);
                    return result.error;
                } else {
                    return result.results;
                }
            });
    })
    .value();

// Make requests
Promise.map(_.range(1), (id) => {
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
        .then((resultJSON) => {
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
    });