FROM rminion
MAINTAINER Jonathan Adams <jd.adams16@gmail.com>

ENV REDIS "localhost"
ENV QUEUE "jobsQueue"

RUN apt-get update \
    && apt-get install -y \
        libgsl-dev \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /R
WORKDIR /R
COPY ./stealTheMoon /R

RUN r -e 'devtools::install()' \
    && chmod +x /R/runMinion.sh

CMD [ "./runMinion.sh" ]