---
title: Complexity is a Choice
abbrlink: f3a4b5c6
tags:
  - architecture
  - design
description: Most software complexity is not inherent but accumulated through decisions
order: 4
---

Fred Brooks distinguished between essential complexity — the irreducible difficulty of the problem — and accidental complexity, the difficulty we introduce through our own choices. Most codebases suffer far more from the latter.

## The Ratchet Effect

Complexity ratchets upward. Each small decision to add an indirection, introduce a framework, or split a service adds a thin layer of accidental complexity. No single layer is the problem. The accumulation is.

## Simplicity as Discipline

Simplicity is not the absence of thought but its distillation. Writing simple code requires understanding the problem deeply enough to see what can be removed.
