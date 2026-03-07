---
title: On Software Entropy
abbrlink: a1b2c3d4
tags:
  - programming
  - rust
description: Why programs fall apart and what we can do about it
order: 1
---

Every sufficiently complex program carries within it the seeds of its own decay[^1]. This is not a flaw in engineering — it is a law of nature applied to code.

[^1]: This idea echoes Lehman's laws of software evolution (1974), which observe that programs must continually adapt or become progressively less useful in their environment.

## The Second Law of Software

Just as thermodynamic systems tend toward disorder, software systems tend toward complexity[^2]. Each patch, each feature, each "quick fix" increases the entropy of the whole. What began as a clean architecture becomes, over time, a labyrinth of special cases.

[^2]: The analogy to thermodynamic entropy is more than metaphorical. Boltzmann's insight was that disorder is overwhelmingly more probable than order — there are far more ways for a system to be disordered than ordered. The same applies to codebases: the space of "messy but working" configurations vastly outnumbers the space of "clean and correct" ones.

The question is not whether your program will fall apart — it will. The question is whether you can build systems that degrade gracefully, that reveal their fractures before they shatter.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.

## Resisting Entropy

There are strategies. Strong type systems act as structural reinforcement. Pure functions create pockets of predictability. Tests document the intended behavior against which decay can be measured.

But perhaps the most powerful tool is simply awareness — the discipline to recognize when complexity has outgrown its container, and the courage to rewrite rather than patch.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nulla facilisi. Etiam non diam ante. Fusce lacinia arcu et nulla. Nulla vitae massa in eros convallis posuere. Pellentesque dapibus hendrerit tortor. Praesent blandit laoreet nibh. Fusce convallis metus id felis luctus adipiscing.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

## The Anatomy of Decay

Software decay follows predictable patterns. First, the abstractions begin to leak. A function that once had a single responsibility acquires a second, then a third. Parameters multiply. Return types grow more complex. The interface that was once a clean contract becomes a negotiation.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.

Then the dependencies tangle. Module A imports from Module B, which imports from Module C, which — inevitably — imports from Module A. The dependency graph, once a tree, becomes a web. Changes propagate unpredictably. A fix in one corner breaks something in another.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.

## The Beauty of Failure

There is something honest about a program that fails clearly[^3]. A panic with a stack trace is more trustworthy than silent corruption. Rust understood this: make failure explicit, make the programmer confront every edge case, and the result is software that wears its fragility on its sleeve.

[^3]: Erlang's "let it crash" philosophy takes this further — rather than trying to prevent failure, design systems that recover from it automatically. Joe Armstrong called this "programming for the normal case" and letting supervisors handle the rest.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.

Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.

Programs fall apart. The best ones do so gracefully.
