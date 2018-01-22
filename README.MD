Overview API
============================

Personal Project Management API

Project Management API tailored for my freelancing gigs. Inspired by Trello, Asana, Dapulse & Wrike.

[![Codeship](https://img.shields.io/codeship/ab748e30-81b5-0135-4477-4ec5e3c9a2b0/dev.svg?style=flat-square)](https://app.codeship.com/projects/246980)
[![Codecov](https://img.shields.io/codecov/c/github/supergithubo/overview-api/dev.svg?style=flat-square)](https://codecov.io/gh/supergithubo/overview-api)
[![Codacy grade](https://img.shields.io/codacy/grade/24746844097445aa806f4bb9c2364f87/dev.svg?style=flat-square)](https://www.codacy.com/app/winston.los.santos/overview-api/dashboard)

## REQUIREMENTS

- [Node v6.11.x](https://nodejs.org/en/blog/release/v6.11.0/) (LTS: Boron)
- [MongoDB v3.4.x](https://docs.mongodb.com/manual/release-notes/3.4/)

## INSTALLATION

```
npm install
```

or with [Node Version Manager](https://github.com/creationix/nvm) via `.nvrmc`

```
nvm use
npm install
```

## API

### Auth (using express-auth dep)
- [x] POST /auth/register
- [x] POST /auth/login
- [x] POST /auth/password/change
- [ ] POST /auth/password/reset
- [x] POST /auth/password/reset/confirm

### Folder
- [x] GET /folders
- [x] POST /folders
- [x] GET /folders/:folder
- [x] PUT /folders/:folder
- [x] DELETE /folders/:folder

### Task
- [x] GET /folders/:folder/tasks
- [x] POST /folders/:folder/tasks
- [x] GET /folders/:folder/tasks/:task
- [x] PUT /folders/:folder/tasks/:task
- [x] DELETE /folders/:folder/tasks/:task

### Log
- [ ] GET /folders/:folder/tasks/:task/log
- [ ] POST /folders/:folder/tasks/:task/log
- [ ] GET /folders/:folder/tasks/:task/log/:log
- [ ] PUT /folders/:folder/tasks/:task/log/:log
- [ ] DELETE /folders/:folder/tasks/:task/log/:log

### Workflow
- [x] GET /workflows
- [x] POST /workflows
- [x] GET /workflows/:workflow
- [x] PUT /workflows/:workflow
- [x] DELETE /workflows/:workflow

### Priority
- [x] GET /priorities
- [x] POST /priorities
- [x] GET /priorities/:priority
- [x] PUT /priorities/:priority
- [x] DELETE /priorities/:priority

### Company / Client
- [ ] GET /companies
- [ ] POST /companies
- [ ] GET /companies/:company
- [ ] PUT /companies/:company
- [ ] DELETE /companies/:company

### Contact
- [ ] GET /companies/:company/contacts
- [ ] POST /companies/:company/contacts
- [ ] GET /companies/:company/contacts/:contact
- [ ] PUT /companies/:company/contacts/:contact
- [ ] DELETE /companies/:company/contacts/:contact

### Self (misc)
- [x] GET /self
- [ ] PUT /self

### Admin (misc)
- [x] GET /admin/users
- [ ] POST /admin/users
- [ ] GET /admin/users/:user
- [ ] PUT /admin/users/:user
- [x] DELETE /admin/users/:user
- [ ] POST /admin/users/:user/reset


## TESTS

```
npm run test
```

Code coverage:

```
npm run coverage
```

## CONTRIBUTING

#### NOTE

> Express Auth (Auth Dependency) is still in private development stage. Contributions are recommended after its release.
