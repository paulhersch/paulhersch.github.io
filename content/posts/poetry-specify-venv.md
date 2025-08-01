+++
title = 'How to use poetry to install dependencies into a specified Venv'
date = 2025-08-01T15:00:00+02:00
draft = false
summary = 'Why the fuck did they remove the export plugin'
+++

## The issue

So lets say You have a python project that needs to be run in a docker
container and You have poetry set up for dependency management and to build the
entire thing. Lets say you also added a previous poetry project as local dependeny
because its proprietary code and You don't happen to have a Python package repo for
Your organization.

If you are like me, Your previous Dockerfile for a Poetry project
might have had something along the lines of this in it:

```Dockerfile
RUN apt install -y gcc \
    && pip install poetry \
    && python -m venv /venv \
    && poetry export -f requirements.txt | /venv/bin/pip install -r /dev/stdin
```

But for some reason, the poetry maintainers decided, that one should no longer
to be able to use the `poetry export` function by default and the plugin isn't
installed in the default pip package any more. This is how one can achieve
something similar.

## What is needed?

Poetry will install Dependencies in an activated environment if one exists and
otherwise create one by itself. Sadly there is no option, to force the
environment into a specfic path, as the maintainers deemed this functionality
unneccessary.

### Option 1: Simply install the old plugin (if You don't have local dependencies)

The simplest option: You can always just reinstall the plugin before running the export command:

```Dockerfile
RUN apt install -y gcc \
    && pip install poetry \
    && python -m venv /venv \
    && poetry self add poetry-plugin \
    && poetry export -f requirements.txt | /venv/bin/pip install -r /dev/stdin
```

The problem i ran into here, is that now the installation is delegated to pip and i used a subdirectory as
package. Pip does not like this.

### Option 2: Activate venv before running poetry

This is what i settled on later. It is really just that simple, as long as poetry is inside an activated venv.
The only issue is, that to activate the venv bash is needed, and the default shell used in `RUN` is `/bin/sh`
(so probably `ash`, as the python container is based on Debian).

```Dockerfile
RUN python -m venv /venv \
    && bash -c "source /venv/bin/activate && /venv/bin/pip install poetry && /venv/bin/poetry install --no-root"
```

This will then properly install all the dependencies into the activated venv with poetry.

## Full Dockerfile example with Option 2

A full example of my default multistage build setup for projects with poetry from now on.

```Dockerfile
FROM python:3.12 AS base

RUN apt update \
    && apt install -y <system deps>

FROM base AS pyinstall

# Build tools
RUN apt install -y --no-install-recommends build-essential gcc meson ninja-build

# this can force Poetry to not create its own virtualenv. I have not tested, how well this works without this
# option, better leave it disabled

ENV POETRY_VIRTUALENVS_CREATE=0

WORKDIR /app
COPY ./pyproject.toml ./poetry.lock .
COPY ./<local package> /app/<local package>
RUN python -m venv /venv \
    && bash -c "source /venv/bin/activate && /venv/bin/pip install poetry && /venv/bin/poetry install --no-root"

# Entrypoint
FROM base AS runner 

WORKDIR /app
# Dateien in Container kopieren
COPY --from=pyinstall /venv /venv
COPY ./<project-dir> /app/<project-dir>

CMD [ "/venv/bin/python", "-m", "<project-dir>" ]
```

Hopefully, i could help anyone who was as lost as me!
