---
name: using-superpowers
description: "Introduction to the Superpowers skills system - a complete software development workflow for coding agents."
---

# Superpowers Skills Framework

An agentic skills framework and software development methodology that works.

## Overview

Superpowers is a complete software development workflow built on composable skills. The skills trigger automatically based on context, enforcing best practices for design, implementation, testing, and code review.

## The Basic Workflow

```
1. BRAINSTORMING → Design before code
2. USING-GIT-WORKTREES → Isolated workspace
3. WRITING-PLANS → Detailed implementation plan
4. SUBAGENT-DRIVEN-DEVELOPMENT or EXECUTING-PLANS → Task execution
5. TEST-DRIVEN-DEVELOPMENT → RED-GREEN-REFACTOR
6. REQUESTING-CODE-REVIEW → Quality gates
7. FINISHING-A-DEVELOPMENT-BRANCH → Merge/PR decision
```

## Skills Library

### Testing
- **test-driven-development** - RED-GREEN-REFACTOR cycle (includes testing anti-patterns reference)

### Debugging
- **systematic-debugging** - 4-phase root cause process (includes root-cause-tracing, defense-in-depth)
- **verification-before-completion** - Ensure it's actually fixed

### Collaboration & Workflow
- **brainstorming** - Socratic design refinement
- **writing-plans** - Detailed implementation plans
- **executing-plans** - Batch execution with checkpoints
- **subagent-driven-development** - Fast iteration with two-stage review
- **requesting-code-review** - Pre-review checklist
- **using-git-worktrees** - Parallel development branches
- **finishing-a-development-branch** - Merge/PR decision workflow

## Philosophy

1. **Design Before Code** - Brainstorm and validate before implementing
2. **TDD Always** - No production code without a failing test first
3. **Root Cause First** - Never guess at fixes; investigate systematically
4. **Evidence Before Claims** - Run verification before claiming success
5. **Review Early, Review Often** - Catch issues before they cascade
6. **Isolated Workspaces** - Git worktrees for parallel development

## How It Works

The skills trigger automatically based on context:

- **Before creative work** → brainstorming activates
- **After design approval** → using-git-worktrees activates
- **With approved design** → writing-plans activates
- **With plan** → subagent-driven-development or executing-plans activates
- **During implementation** → test-driven-development activates
- **Between tasks** → requesting-code-review activates
- **When tasks complete** → finishing-a-development-branch activates

## Key Principles

- **YAGNI** - You Aren't Gonna Need It
- **DRY** - Don't Repeat Yourself
- **TDD** - Test-Driven Development
- **Frequent Commits** - Small, focused changes
- **Systematic Debugging** - Root cause before fixes

## Credit

Based on [obra/superpowers](https://github.com/obra/superpowers) by Jesse Vincent.
