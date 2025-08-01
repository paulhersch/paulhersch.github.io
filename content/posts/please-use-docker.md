+++
title = 'The script that could have been a CI pipeline'
date = 2025-04-26T14:46:49+02:00
draft = false
summary = 'A story about my previous workplace'
+++

_Quick disclaimer: This is all high-level nitpicking, i kind of got pissed of,
that my colleagues sometimes just refused to learn stuff because it seemed
impractical to them, although i thought using something like a CI would be
really useful._

Its some random tuesday at 2pm. I get to my workplace (clocking in would be too
ambitious of a word, as i only worked 7 hours a week) and keep setting up the
database, that could have been a docker container. I just got done writing some
basic internal django application to replace spreadsheets to hopefully ease the
way into a more automated account management for people that get hired by
"outsider departments".[^1]

Of course this thing needs a database, as all respectable and useful projects
do and of course this database can't just be a docker container deployed to the
kubernetes cluster, because then the application itself would have to be a
docker container deployed to said cluster as well and my PM did not feel
comfortable relying on either kubernetes or me to properly set the
containerization up in a way we don't lose data.

Instead we now have two completely independend Ubuntu images that will probably
always stay on 22.04 until the end of time, both running one application that
could have been a docker container. Both images have full access to the
internal network (so you can log in via ssh). Both images have their entire
virtual disk saved on the cluster. Both images can be broken by uninstalling
some random package via apt.

Its the Friday after the Tuesday, 9am, and the applications container is not
accessible from inside the network. Apparently i have uninstalled some very
very important package when i installed the drivers to access the Postgres
Database. I did not remember any of this, and sadly my actions weren't locked
in something like a Dockerfile where one could check how an issue like this can
be resolved in the future. What a shame! But these things happen and are
unavoidable!

Its Tuesday again. The application container works and now we have to make
sure, that you can only access the prod DB from the application container or
the WiFi APs on our floor. I accidentially lock the application out of the DB,
because i was too lazy to properly read the Postgres Docs[^2] just to set up
the DB that could have been a container. I fix the issue after 30 minutes (now
actually having read the Docs) and almost everything is ready to go! Just one
hiccup: We need a version of this application to test new code. Luckily i
properly documented the whole setup process before, so that isn't that big of
an issue, besides of course the possibility that one might change a setting or
two in testing and didn't document it for prod. Really makes one think there
might be a better way to do this, but at this point i have accepted my fate and
just do as i am told, while the Dockerfile i set up for testing on my machine
rots into insignificance.

## "Can you show me how this works?"

my coworker across the rooms asks me, dissecting the Server one of the recently
let go employees set up. It basically was their pet project that somehow turned
into critical infra at some point, as the guy managed synthesizing and syncing
AD groups into mailing lists and like 10 other things because the IT was and is
overloaded with tasks (a tale as old as time).

I go over to my coworkers desk and we both look at the (in my opinion) neatly
organized folder structure that sets up this servers software. Its all
docker-compose files, put into a folder at the persistent root of the
container. To my eyes this all makes sense, just 4 services, all with their own
resources, some mounted into the container, some exposing ports to the hosts so
that outside software can connect. My coworker however, does not know how to
read and interpret those concise definitions, that could have been three pages
of documentation, thus this has to go in favor of manually set up system
services.

In this moment it made sense to me, why we went the route of setting up three
different servers that could have been a docker container earlier: the people i
am working with in this moment never really learned how to use docker. To them
containerizing and isolating workloads is a flashy concept from big companies,
that they could surely never adapt to as they are just the universities IT
department.

## Utter horror

Another random tuesday. It is between 2 and 4pm, the time i now step down from
developing useful software that might not actually be used and start doing tech
support for the email team. For some reason the influx of new tickets was very
high for an hour at the start of the day and nothing besides that. A LOT of
people didn't get their emails. Apparently the spam filter in prod was
misconfigured and a whitespace at the start of a regular expression not
escaped, so every Mail subject was matched. This took 3 minutes to notice.

How did it come to this? Apparently, there is no testing process for the spam
rules. We do had good and bad subjects that could be used for testing, but both
lists were not synchronized between gateways and to test the lists one would
have to run them manually, which of course you would never do unless forced
into compliance. "It just is like that sometimes", my coworker says "we tried
implementing a process via pulling the lists from git, but its such a pain to
go into each server and update them after a change".

What?

"Why don't we just test and update in case of success with a CI Pipeline?".
Those seemed to be some dreaded words to him and the other coworker who just
entered to use the coffee machine. Apparently, they had some bad experiences
with CI pipelines and its a big unknown where all the data goes and comes from
and those pipelines also seem to use these pesky docker containers that are
uncontrollable.

So now there is a script checking all the regular expressions against all the
subjects every two minutes that will roll the rules back on a match. I now
successfully wrote the script that could have been a CI pipeline.

[^1]: This just means that those are hires who neither teach or have some form
    of civil servant status
[^2]: Absolutely no hate here, i really like the Docs. On the other hand i
    didn't want to read the entire thing just for some IP whitelisting.
