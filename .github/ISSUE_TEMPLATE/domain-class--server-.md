---
name: Domain Class (server)
about: Checklist for adding domain classes
title: "[Implement Domain Class: Server] <Enter name here>"
labels: Requirement, server
assignees: ''

---

## Database
- [ ] ER-analysis - add to diagram, properties and all.
- [ ] Figure out Neo4J-realization (ie labels, et al)
- - [ ] Label on node
- - [ ] Label on relationships
- [ ] Write a PoC data block for import (ie test/mock-data)

## Serverside

### Model
- [ ] Figure out what functionality will be needed beside CRUD and implement
- [ ] Implement CRUD
- [ ] I18n if necessary

### Service
- [ ] Figure out what functionality will be needed beside CRUD and implement
- [ ] Implement CRUD
- [ ] I18n if necessary
- [ ] Write tests for functionality outside main call chain.

### Controller
- [ ] Figure out what functionality will be needed beside CRUD and implement
- [ ] Implement CRUD
- [ ] I18n if necessary
- [ ] Validation per route

### Route
- [ ] Make sure routes are accessible and hooked up.
