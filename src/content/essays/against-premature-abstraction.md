---
title: Against Premature Abstraction
abbrlink: c9d0e1f2
tags:
  - programming
  - design
description: Why three lines of duplicated code are often better than one wrong abstraction
order: 3
---

Abstraction is the programmer's most powerful tool and most seductive trap. We are taught to never repeat ourselves, to extract and generalize at the first sign of duplication. But this instinct, applied too early, creates more problems than it solves.

## The Cost of the Wrong Abstraction

Sandi Metz observed that duplication is far cheaper than the wrong abstraction. A wrong abstraction, once established, becomes load-bearing. Code depends on it, tests validate it, and developers build mental models around it.

## When to Abstract

The right time to abstract is not when you see duplication, but when you understand the underlying pattern well enough to name it. If you cannot name the abstraction clearly, you do not yet understand it well enough to create it.
