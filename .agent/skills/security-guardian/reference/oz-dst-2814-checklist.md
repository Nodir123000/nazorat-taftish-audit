# O'z DSt 2814:2014 Compliance Checklist — АИС КРР

Classification: **КЗ-2** (Confidential) — МО data with PINFL.

---

## Section 1: Access Control

- [ ] **1.1** RBAC implemented for all modules
- [ ] **1.2** Minimum privilege principle per role
- [ ] **1.3** Admin can create/modify/delete users
- [ ] **1.4** Viewer role is read-only
- [ ] **1.5** Inspector accesses only own audits
- [ ] **1.6** Session timeout: 30 min inactivity → auto logout
- [ ] **1.7** Account lock after 5 failed login attempts (15 min)
- [ ] **1.8** Password: min 8 chars, uppercase + lowercase + digit
- [ ] **1.9** Password change required every 90 days

## Section 2: Data Protection

- [ ] **2.1** PINFL masked for non-privileged roles
- [ ] **2.2** Passport data masked for non-privileged roles
- [ ] **2.3** All transmission over HTTPS/TLS 1.2+
- [ ] **2.4** No sensitive data in URL parameters
- [ ] **2.5** Database connection encrypted
- [ ] **2.6** Backups encrypted (AES-256 minimum)
- [ ] **2.7** Backups stored separately from primary system

## Section 3: Audit and Logging

- [ ] **3.1** All auth events logged (login, logout, failed)
- [ ] **3.2** All mutations logged in `audit_log` (CREATE/UPDATE/DELETE)
- [ ] **3.3** Log fields: timestamp, user_id, action, table, record_id, old_values, new_values
- [ ] **3.4** Log includes IP address
- [ ] **3.5** Logs retained minimum 3 years
- [ ] **3.6** audit_log table is read-only (no UPDATE/DELETE allowed)
- [ ] **3.7** Log viewer restricted to admin role

## Section 4: Input Validation

- [ ] **4.1** All API inputs validated with Zod schema
- [ ] **4.2** SQL injection prevented via Prisma parameterized queries
- [ ] **4.3** XSS prevented via React default escaping + CSP headers
- [ ] **4.4** File upload size and type restrictions
- [ ] **4.5** CSRF protection on state-changing requests

## Section 5: Error Handling

- [ ] **5.1** No stack traces exposed in production
- [ ] **5.2** No DB error details exposed to client
- [ ] **5.3** Generic messages for auth failures
- [ ] **5.4** All unhandled errors logged server-side

## Section 6: Cryptography

- [ ] **6.1** Passwords hashed with bcrypt (cost ≥ 12) or Argon2
- [ ] **6.2** Session tokens cryptographically random (128-bit min)
- [ ] **6.3** No MD5 or SHA-1 for security purposes
- [ ] **6.4** JWT secrets minimum 256-bit if JWT used

## Section 7: Network Security

- [ ] **7.1** HTTP redirects to HTTPS
- [ ] **7.2** HSTS header configured
- [ ] **7.3** CSP header configured
- [ ] **7.4** X-Frame-Options: DENY
- [ ] **7.5** X-Content-Type-Options: nosniff
- [ ] **7.6** Rate limiting on auth endpoints

## Compliance Score

| Score | Status |
|-------|--------|
| 95–100% | ✅ Compliant |
| 80–94% | ⚠️ Minor gaps |
| 60–79% | 🟠 Significant gaps |
| < 60% | 🔴 Non-compliant |

**КЗ-2 МО system minimum: 90%**
