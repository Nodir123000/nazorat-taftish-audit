# Database Seeding

## Control Authority Priority Initialization

The collision detection system requires control authorities to have priority levels defining the hierarchical authority structure:

- **Priority 1 (Master)**: Ministry-level control authorities (e.g., КРУ МО РУ)
- **Priority 2 (Central)**: Central government and military command authorities
- **Priority 3 (Regional)**: Regional and local government authorities

This hierarchy ensures that the collision detection system properly validates authority assignments and enforces access control based on organizational levels.

### Run Authority Seed

```bash
npm run seed:authorities
```

This command will:
- Create missing authorities with proper priority levels
- Update priority levels on existing authorities that have incorrect assignments
- Log all changes made during the seed process
- Validate the complete hierarchy is in place
- Report on the distribution of authorities across levels

### Verify Authorities

After seeding, verify the authority hierarchy is correctly configured:

```bash
npm run verify:authorities
```

This displays all authorities and their current priority levels, grouped by hierarchy level (Master, Central, Regional).

### Seed is Idempotent

The seed script is safe to run multiple times. It uses an upsert pattern that:
- Checks if each authority already exists
- Creates new authorities if missing
- Updates priority levels only if they differ from the configured values
- Reports what actions were taken

### Authority Configuration

The seed script initializes these authorities:

| Code | Name (Russian) | Priority | Level |
|------|---|---|---|
| КРУ МО РУ | Главное управление контроля Министерства обороны | 1 | Master |
| ГФЭУ МО РУ | Главное финансово-экономическое управление | 1 | Master |
| CENTRAL_INSPECTION | Центральная служба внутреннего контроля | 2 | Central |
| REGIONAL_INSPECTION | Региональная служба контроля | 3 | Regional |
| MILITARY_COMMAND | Военное командование | 2 | Central |

### Manual Authority Updates

To manually update an authority's priority level:

```bash
npx prisma db execute --stdin <<EOF
UPDATE "ref_control_authorities"
SET "priority_level" = 2
WHERE "code" = 'YOUR_AUTHORITY_CODE';
EOF
```

### Integration with Deployment

Add these steps to your deployment or initialization process:

```bash
# Run schema migrations
npm run db:push

# Seed control authorities
npm run seed:authorities

# Verify authorities are properly configured
npm run verify:authorities
```

### Collision Detection & Authority Hierarchy

The collision detection system uses authority priorities to:

1. **Validate authority assignments** - Ensure planners belong to appropriate hierarchy level
2. **Detect overlapping plans** - Check for resource conflicts based on authority jurisdiction
3. **Enforce access control** - Restrict actions based on user's authority level
4. **Log authority changes** - Audit trail of collision events by priority level

For details on collision detection, see [Constraint Engine Implementation](./constraint-engine.md).

### Troubleshooting

**No authorities created/updated?**
- Check DATABASE_URL environment variable is set correctly
- Verify database connection is working: `npx prisma db execute`
- Check for unique constraint violations on `code` field

**Authorities have null priority levels?**
- Run the seed script: `npm run seed:authorities`
- Check that all authorities in the database have a priority_level value (1, 2, or 3)

**Hierarchy seems incomplete?**
- Run verification: `npm run verify:authorities`
- This will show you which authority levels are missing
- Add or seed missing authorities as needed

### Authority Naming Conventions

Authority names are stored as JSON with multi-language support:

```json
{
  "ru": "Russian name",
  "uz": "Latin name",
  "uzk": "Cyrillic name"
}
```

When adding new authorities, provide names in all three languages for complete localization support.
