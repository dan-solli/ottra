---
name: Add domain class
about: Checklist for adding domain classes
title: "[Domain Class] <Enter name here>"
labels: Requirement, client, server
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

### Route
- [ ] Make sure route is accessible and hooked up.

## Clientside

### Vuex
- [ ] Create new module
- [ ] I18n if necessary

### Router
- [ ] Add to router.

### Repository
- [ ] Create the actual domain class specific repository.
- [ ] Add to repository factory

### Create Views for CRUD
- Create
- - [ ] I18n
- - [ ] Tour
- - [ ] Tooltips
- - [ ] Hotkeys
- - [ ] Right click context menu
- Read: Collection
- - [ ] I18n
- - [ ] Tour
- - [ ] Tooltips
- - [ ] Hotkeys
- - [ ] Right click context menu
- Read: Single Item
- - [ ] I18n
- - [ ] Tour
- - [ ] Tooltips
- - [ ] Hotkeys
- - [ ] Right click context menu
- Update
- - [ ] I18n
- - [ ] Tour
- - [ ] Tooltips
- - [ ] Hotkeys
- - [ ] Right click context menu
- Delete
- - [ ] I18n
- - [ ] Tour
- - [ ] Tooltips
- - [ ] Hotkeys
- - [ ] Right click context menu
