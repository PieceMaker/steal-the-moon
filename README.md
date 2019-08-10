# steal-the-moon

This project serves as a demonstration of using the R package [rminions](https://github.com/PieceMaker/rminions).

## R Package

This project includes an R package that contains functionality for running a simulation of a journey to and from the
moon, including base fuel considerations and changes in the fuel requirements in the presence of solar flares and
asteroids. The main simulation function is `simulateTrip` which generates the results of a single trip based on
distributional inputs.

In a typical Monte Carlo simulation, this function would be executed 10,000 times and the results summarized to
generate a non-parametric distribution. This simulation can take quite a bit of time in a single process, so this
project will show how to use `rminions` to substantially speed up this simulation.