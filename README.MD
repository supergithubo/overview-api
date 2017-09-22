Overview API
============================

Personal Project Management API

REST API for a Project Management App (Angular 4) I am planning to develop tailored for my freelancing gigs. Inspired by Trello, Asana, Dapulse & Wrike.

[![Codeship](https://img.shields.io/codeship/031e1990-2a8c-0135-24b2-028526252516/dev.svg)]()
[![Codacy branch grade](https://img.shields.io/codacy/grade/32d37310c5ec4cadbda1a34f935da57a/dev.svg)]()

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

### Auth (using express-auth module)
- [x] POST /auth/register
- [x] POST /auth/login
- [x] POST /auth/password/change
- [ ] POST /auth/password/reset
- [x] POST /auth/password/reset/confirm

### Folder
- [ ] GET /folders
- [x] POST /folders
- [x] GET /folders/:folder
- [x] PUT /folders/:folder
- [x] DELETE /folders/:folder

### Task
- [ ] GET /folders/:folder/tasks
- [ ] POST /folders/:folder/tasks
- [ ] GET /folders/:folder/tasks/:task
- [ ] PUT /folders/:folder/tasks/:task
- [ ] DELETE /folders/:folder/tasks/:task

### Log
- [ ] GET /folders/:folder/tasks/:task/log
- [ ] POST /folders/:folder/tasks/:task/log
- [ ] GET /folders/:folder/tasks/:task/log/:log
- [ ] PUT /folders/:folder/tasks/:task/log/:log
- [ ] DELETE /folders/:folder/tasks/:task/log/:log

### Workflow
- [ ] GET /workflows
- [ ] POST /workflows
- [ ] GET /workflows/:workflow
- [ ] PUT /workflows/:workflow
- [ ] DELETE /workflows/:workflow

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

============================