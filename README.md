# steal-the-moon

This project serves as a demonstration of using the R package [rminions](https://github.com/PieceMaker/rminions).

## Installation

In order to install the `stealTheMoon` package you will first need to install the `devtools` package.

```R
install.packages("devtools")
```

From here you can install the `stealTheMoon` package directly from GitHub.

```R
devtools::install_github("PieceMaker/rminions", subdir = 'stealTheMoon')
```

## R Package

This project includes an R package that contains functionality for running a simulation of a journey to and from the
moon, including base fuel considerations and changes in the fuel requirements in the presence of solar flares and
asteroids. The main simulation function is `simulateTrip` which generates the results of a single trip based on
distributional inputs.

In a typical Monte Carlo simulation, this function would be executed 10,000 times and the results summarized to
generate a non-parametric distribution. This simulation can take quite a bit of time in a single process, so this
project will show how to use `rminions` to substantially speed up this simulation.

## Docker

This project contains a Dockerfile that installs the stealTheMoon package and then starts a worker. It starts from
the Docker image built in the [rminions](https://github.com/PieceMaker/rminions) repository. It explicitly redefines
the environment variables for the worker for convenience, but it uses the shell script that was added in the base
image, located at `/R/runMinion.sh`.

To build the Docker image, you will need to have built the base minion image locally as it is not yet published to
the Docker repository. It will need to be tagged as `minion-worker`. Then you can build the simulation worker by
running the following:

```bash
docker build -t moon-worker .
```

This will build the image locally and tag it as `moon-worker`.

Since we are referring to our Redis server as Gru-svr, we need to set the environment variable appropriately:

```bash
export REDIS="Gru-svr"
```

We are now ready to run the Dockerized worker.

```bash
docker run --rm moon-worker
```

You should now have a simulation worker running that is connected to the central Redis server and awaiting requests on
the queue `"jobsQueue"`.

## Make Request

The function `simulateTrip` requires a set of distributional inputs to run. These can be generated with the function
`generateSimulationParameters`. This function returns a list of the three parameters `simulateTrip` accepts. You can
run the function as follows:

```R
library(stealTheMoon)
parameters <- generateSimulationParameters()
simulateTrip(baseFuel = parameters$baseFuel, solarFlares = parameters$solarFlares, asteroids = parameters$asteroids)
```

If you wish to make the request to a minion worker, use the following code:

```R
reduxConn <- redux::hiredis(host = 'Gru-svr')
parameters <- generateSimulationParameters()
rminions::sendMessage(
    conn = reduxConn,
    package = 'stealTheMoon',
    func = 'simulateTrip',
    parameters = parameters
)
```

Once the function has run, you can get the result via

```R
result <- rminions::getMessage(
    conn = reduxConn,
    queue = 'resultsQueue'
)
```