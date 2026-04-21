# Decision Trees — АИС КРР

Complex scenario flows for кru inspection domain.

---

## Tree 1: New Violation Discovered

```
Inspector finds a violation
│
├─ Determine type
│   ├─ Financial? → illegal_expense / overpayment / cash_shortage / embezzlement / misuse_of_funds
│   ├─ Property? → property_shortage / property_surplus / improper_storage / unlawful_writeoff
│   ├─ Procedural? → accounting_violation / procurement_violation / labor_violation / staffing_violation
│   └─ Special? → corruption_risk / other
│
├─ Determine severity
│   ├─ CRITICAL → cash_shortage / embezzlement / corruption_risk
│   ├─ HIGH → illegal_expense / misuse_of_funds / property_shortage / unlawful_writeoff / procurement_violation
│   ├─ MEDIUM → overpayment / improper_storage / accounting_violation / staffing_violation
│   └─ LOW → property_surplus / labor_violation
│
├─ Special flags
│   ├─ embezzlement → set criminal_referral = true, notify chief_inspector IMMEDIATELY
│   └─ corruption_risk → escalate to chief_inspector, do NOT notify inspector's commander yet
│
└─ Create decision
    ├─ CRITICAL → deadline = 10 work days from today
    ├─ HIGH → deadline = 20 work days
    ├─ MEDIUM → deadline = 30 work days
    └─ LOW → deadline = 60 work days
```

---

## Tree 2: Audit Status Transitions

```
[draft]
  │
  ├─ REQUIRED before → planned:
  │   • ≥1 commission member assigned
  │   • exactly 1 is_responsible = true
  │   • start_date and end_date set
  │
  ↓
[planned]
  │
  ├─ REQUIRED before → in_progress:
  │   • order signed (order.status = 'signed')
  │   • audit report template created
  │
  ↓
[in_progress]
  │
  ├─ Can add violations (status: registered | draft)
  ├─ Can suspend → [suspended] (force majeure or additional materials needed)
  │   └─ From suspended → back to [in_progress] only
  │
  ├─ REQUIRED before → completed:
  │   • All violations have ≥1 decision
  │   • audit_report marked as final
  │   • No violations in draft status
  │
  ↓
[completed]
  │  (read-only, export only)
  │
  └─ After 90 days or admin action → [archived]
```

---

## Tree 3: Decision Overdue Escalation

```
Decision.deadline < today AND status NOT IN [completed, cancelled]
│
├─ Days overdue: 1–7
│   → status = 'overdue'
│   → color indicator: RED in UI
│   → no automatic notification (deadline-watchdog logs it)
│
├─ Days overdue: 8–15
│   → status = 'overdue'
│   → notify: assigned inspector (internal system notification)
│
├─ Days overdue: > 15
│   → status = 'overdue'
│   → notify: chief_inspector
│   → create escalation record in audit_log
│   → flag in daily digest report
│
└─ Days overdue: > 30 AND type = embezzlement/corruption_risk
    → notify: admin
    → create urgent escalation record
    → flag in compliance report
```

---

## Tree 4: Unplanned Audit (Ревизия без плана)

```
Is this audit linked to rev_plan_year?
│
├─ YES (planned) → normal flow, plan_id required
│
└─ NO (unplanned)
    │
    ├─ REQUIRED: order_id must exist (special order issued)
    ├─ plan_id = NULL (allowed)
    ├─ status starts at in_progress (skips planned stage)
    └─ Must document reason for unplanned audit in order.notes
```

---

## Tree 5: Commission Assignment

```
Creating commission for order:
│
├─ Add members from personnel table
│
├─ VALIDATION:
│   ├─ Must have ≥1 member before order can move to planned
│   ├─ Exactly 1 member must have is_responsible = true
│   └─ If 0 responsible → error: "Назначьте ответственного инспектора"
│   └─ If >1 responsible → error: "Только один инспектор может быть ответственным"
│
└─ Inspector can only be added if:
    ├─ user.role = 'inspector' OR 'chief_inspector'
    └─ user.is_active = true
```

---

## Tree 6: PINFL Access Decision

```
Request for personnel data with PINFL:
│
├─ user.role = 'admin' → show full PINFL + passport
├─ user.role = 'chief_inspector' → show full PINFL + passport
├─ user.role = 'inspector' → show masked PINFL (XXXXXX******XX), masked passport
└─ user.role = 'viewer' → show masked PINFL, masked passport
    │
    └─ AND: is this inspector viewing their own record?
        ├─ YES → still masked (rule applies to all non-privileged)
        └─ NO → still masked
```

---

## Tree 7: Violation → Criminal Referral

```
violation.type = 'embezzlement' OR violation.type = 'corruption_risk'
│
├─ Set criminal_referral = true on violation
├─ Create urgent notification to chief_inspector
├─ Create audit_log entry with action = 'CRIMINAL_REFERRAL_TRIGGERED'
│
└─ IF amount > 50,000,000 UZS:
    ├─ Escalate to admin as well
    └─ Flag in compliance report with HIGH urgency
```
