Alternative Splicing Genes Database
===================================

Database to analyze and access alternative spling of genes.

<a href="https://github.com/vchaptsev/cookiecutter-django-vue">
    <img src="https://img.shields.io/badge/built%20with-Cookiecutter%20Django%20Vue-blue.svg" />
</a>


## Development

Install [Docker](https://docs.docker.com/install/) and [Docker-Compose](https://docs.docker.com/compose/). Start your virtual machines with the following shell command:

`docker-compose up --build`

If all works well, you should be able to create an admin account with:

`docker-compose run backend python manage.py createsuperuser`

To access conteiners, ex of backend:

`sudo docker exec -ti asgdb_backend_1 bash`

## Production

To build a production app run:

`sudo docker-compose -f docker-compose-prod.yml build`

Then run:

`sudo docker-compose -f docker-compose-prod.yml up`
