---
title: On Naming Things
abbrlink: b3c4d5e6
date: 2024-10-11T09:30:00.000Z
description: Why naming is the hardest problem in computer science
tags:
  - programming
  - craftsmanship
---

There are only two hard things in computer science: cache invalidation and naming things. Phil Karlton said this decades ago, and it remains stubbornly true.

## Names as Commitments

A name is a compressed explanation. When you call a variable `data`, you have explained nothing. When you call it `unvalidatedUserInput`, you have told the next reader exactly what they are holding and what still needs to happen to it.

## The Refactoring Signal

When a name no longer fits, that is not a cosmetic problem. It is a design signal. The concept has drifted from its label, and the gap between name and reality is where bugs hide.
