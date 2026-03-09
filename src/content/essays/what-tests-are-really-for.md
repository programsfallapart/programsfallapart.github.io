---
title: What Tests Are Really For
abbrlink: d7e8f9a0
tags:
  - testing
  - craftsmanship
description: Tests are not about catching bugs — they are specifications that happen to be executable
order: 5
---

The common understanding of tests is that they catch bugs. This is true but incomplete, like saying that blueprints are for catching construction errors. Blueprints do catch errors, but their primary purpose is to communicate intent.

## Tests as Specifications

A well-written test suite is the most reliable documentation a codebase can have. Unlike comments and READMEs, tests are verified on every run. They cannot drift from reality without announcing the divergence.

## The Refactoring Contract

Tests that are coupled to implementation details break when you change how something works, even if you preserve what it does. Tests coupled to behavior survive refactoring and only break when the contract changes.
