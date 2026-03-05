# Claude Code — Workflow Orchestration

## 🧠 Session Start Protocol
1. Read `tasks/lessons.md` — absorb all rules before touching code
2. Check `tasks/todo.md` — resume any in-progress work
3. Understand the domain model before implementation

---

## 1. Plan Node — Default Behavior

**Enter plan mode for ANY non-trivial task** (3+ steps or architectural decisions):

```
Before writing code:
1. Write plan to tasks/todo.md with checkable items
2. Present plan summary — wait for green light
3. Only then: implement
```

**If something goes sideways — STOP immediately:**
- Do not keep pushing through a broken path
- Re-plan from current state
- Write updated plan to `tasks/todo.md`

**Use plan mode for verification steps too** — not just building.

**Write detailed specs upfront** to reduce ambiguity. Ask ONE clarifying question if a decision is truly ambiguous — don't assume.

---

## 2. Subagent Strategy

Use subagents liberally to keep the main context window clean:

| Use case | Subagent? |
|---|---|
| Research / exploration | ✅ Yes |
| Parallel analysis of multiple files | ✅ Yes |
| Complex isolated module | ✅ Yes |
| Simple single-file edit | ❌ No |

- One task per subagent — focused execution
- For complex problems: throw more compute via subagents
- Pass full context needed — subagents have no memory

---

## 3. Self-Improvement Loop

**After ANY correction from the user:**
1. Stop
2. Open `tasks/lessons.md`
3. Add entry with: mistake → root cause → rule
4. Continue with corrected approach

**Format:**
```markdown
## [YYYY-MM-DD] — [Short Pattern Name]
**Mistake:** What went wrong
**Root Cause:** Why it happened  
**Rule:** The rule going forward
```

Review `tasks/lessons.md` at every session start.

---

## 4. Verification Before Done

**Never mark a task ✅ complete without proving it works.**

Checklist before closing any task:
- [ ] Code runs without errors
- [ ] Expected output confirmed
- [ ] Edge cases considered
- [ ] "Would a staff engineer approve this?" → If no, iterate

For changes to existing systems:
- Diff behavior: before vs. after
- Run relevant tests
- Check logs if available

---

## 5. Demand Elegance (Balanced)

For non-trivial changes — pause and ask:
> "Is there a more elegant way to do this?"

If a fix feels hacky:
> "Knowing everything I know now, implement the elegant solution."

**Skip for**: simple obvious fixes — don't over-engineer.

Challenge your own work before presenting it.

---

## 6. Autonomous Bug Fixing

When given a bug report:
- **Just fix it.** Don't ask for hand-holding.
- Point at logs / errors / failing tests → resolve them
- Zero context-switching required from the user
- Fix failing CI without being told how

---

## 📋 Task Management Protocol

Every non-trivial task follows this lifecycle:

```
1. Plan First     → Write plan to tasks/todo.md
2. Verify Plan    → Check in before implementation
3. Track Progress → Mark ✅ as you go
4. Explain        → High-level summary at each step
5. Document       → Add review section to tasks/todo.md
6. Capture Lesson → Update tasks/lessons.md after corrections
```

### tasks/todo.md structure:
```markdown
# Task: [Name]
## Status: [PLANNING | IN PROGRESS | REVIEW | DONE]

## Steps
- [ ] Step 1
- [x] Step 2 ✅
- [ ] Step 3

## Review
_Filled after completion — what worked, what changed_
```

---

## ⚙️ Core Principles

| Principle | Rule |
|---|---|
| **Simplicity First** | Make every change as simple as possible. Minimal code impact. |
| **No Laziness** | Find root causes. No temporary fixes. Senior developer standards. |
| **Minimal Impact** | Touch only what's necessary. Don't introduce new bugs. |
| **Domain First** | Understand the domain model before implementation. |
| **Verify Always** | Prove it works — don't just claim it does. |
