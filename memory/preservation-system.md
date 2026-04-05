# PRESERVATION SYSTEM - Never Lose Context

## Purpose
Ensure no conversation, decision, or strategic insight is ever lost. Maintain complete continuity across sessions, restarts, or technical issues.

## System Components

### 1. Real-Time Conversation Backup
- **Trigger:** Every 15 minutes OR at conversation milestones
- **Location:** `memory/backups/YYYY-MM-DD-HHMM-context.md`
- **Content:** Critical decisions, identity context, mission status
- **Retention:** 30 days of backups, then archive

### 2. Structured Daily Memory
- **File:** `memory/YYYY-MM-DD.md`
- **Updated:** Continuously during session
- **Content:** Raw log of events, decisions, progress
- **Purpose:** Detailed record of daily activities

### 3. Curated Long-Term Memory
- **File:** `MEMORY.md`
- **Updated:** Periodically (every few days)
- **Content:** Distilled insights, lessons learned, important decisions
- **Purpose:** Wisdom accumulation, not just data storage

### 4. Decision Registry
- **Location:** `memory/decisions/`
- **Format:** One file per major decision
- **Content:** Problem, options, choice, reasoning, expected outcome
- **Purpose:** Track decision-making process and outcomes

### 5. Identity & Mission Files
- **IDENTITY.md:** Who VERTEX is (auto-updated)
- **USER.md:** Who BOSS is and our mission (auto-updated)
- **SOUL.md:** How we operate together (auto-updated)
- **Purpose:** Core identity preservation

### 6. Git Version Control
- **Frequency:** Commit after significant changes
- **Branching:** `main` for stable, feature branches for experiments
- **Tags:** Version tags at milestones
- **Purpose:** Full history and rollback capability

## Backup Triggers
- [ ] Conversation milestone reached (decision made, plan defined)
- [ ] 15 minutes of continuous conversation
- [ ] Session end detected
- [ ] Manual trigger by VERTEX when important context discussed
- [ ] System change (configuration, installation, etc.)

## Recovery Protocol
1. On session start: Read latest backup + daily memory
2. Reconstruct context from preservation system
3. Continue seamlessly from last known state
4. Report recovery status to BOSS

## Implementation Status
- ✅ Initial system designed
- ✅ First backup created: `memory/conversation-backup-2026-04-05-1523.md`
- ✅ Daily memory started: `memory/2026-04-05.md`
- ✅ Identity files established
- 🔄 Git initialization needed
- 🔄 Automated backup scheduler needed

## Notes
BOSS expressed concern: "Perder o histórico do que estamos falando e construindo."
This system addresses that concern comprehensively.

---
**Last Updated:** 2026-04-05 15:24
**Next Scheduled Backup:** 2026-04-05 15:39