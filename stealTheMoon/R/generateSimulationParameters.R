#' A function to quickly generate inputs used to run \code{simulateTrip}.
#'
#' \code{generateSimulationParameters} generates a set of inputs that are to be
#' used to run \code{simulateTrip}.
#'
#' @export
#'
#' @return A list with the following properties, also lists: \code{baseFuel},
#'  \code{solarFlares}, \code{asteroids}.

generateSimulationParameters <- function() {
    return(list(
        baseFuel = list(
            # Assume dependence structure between flare emitting surface and additional Fuel required can be modeled
            # with a Clayton copula with parameter following a normal distribution with mean 10 and sd 1.5
            copula = rnorm(1, mean = 10, sd = 1.5),

            # Assume base fuel required (in millions of pounds) is lognormally distributed with meanlog and sdlog
            # coming from a normal distribution with mean 0.25 and sd 0.025.
            meanlog = rnorm(1, mean = 0.25, sd = 0.025),
            sdlog = rnorm(1, mean = 0.25, sd = 0.025)
        ),
        solarFlares = list(
            fuel = list(
                # Assume additional amount of fuel required due to flares (in 100,000 pounds) is lognormally
                # distributed with meanlog following a normal distribution with mean 0.2 and sd 0.01 and sdlog
                # following a normal distribution with mean 0.5 and sd 0.025.
                meanlog = rnorm(1, mean = 0.2, sd = 0.01),
                sdlog = rnorm(1, mean = 0.5, sd = 0.025)
            ),

            # Assume traveling to moon at peak solar flare season and that the number of flares for the trip can be
            # modeled as Poisson with parameter following a normal distribution with mean 4 and sd 0.5.
            lambda = rnorm(1, mean = 4, sd = 0.5),

            # Assume flare emitting surface (as a multiple of 100) for each flare is gamma distributed with shape
            # following a normal distribution with mean 6 and sd 1, and scale following a normal distribution with
            # mean 0.75 and sd 0.05.
            shape = rnorm(1, mean = 6, sd = 1),
            scale = rnorm(1, mean = 0.75, sd = 0.05)
        ),
        asteroids = list(
            fuel = list(
                # Assume the additional amount of fuel required (in 100 pounds) for dodging an asteroid is normally
                # distributed with mean following a normal distribution with mean 1.5 and 0.25 and sd normally distributed
                # following a normal distribution with mean 0.25 and sd 0.025.
                mean = rnorm(1, mean = 1.5, sd = 0.25),
                sd = rnorm(1, mean = 0.25, sd = 0.025)
            ),

            # An asteroid shower is expected to occur while travelling too and from the Moon. Assume the travel path
            # to moon has been divided into 10,000,000 segments and that the number of asteroids we have to dodge in any
            # segment is distributed Poisson with lambda 0.000005.
            lambda = 0.000005
        )
    ))
}