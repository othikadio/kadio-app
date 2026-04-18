# Kadio Supabase Deployment Checklist

## Pre-Deployment

- [ ] Supabase project created
- [ ] Project URL and API keys obtained
- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] PostgreSQL 14+ available
- [ ] All migration files reviewed
- [ ] Backup of any existing data taken

## File Verification

- [ ] `001_initial_schema.sql` — 815 lines, 28 tables
- [ ] `002_seed_data.sql` — 294 lines, 6 plans, 18 services, 14 modules
- [ ] `003_functions_and_helpers.sql` — 549 lines, 13 functions, 7 views
- [ ] `README.md` — Documentation complete
- [ ] `MIGRATION_SUMMARY.md` — Summary accurate
- [ ] `QUICK_REFERENCE.md` — Reference guide complete

## Deployment Steps

### Option A: Supabase CLI (Recommended)

```bash
# 1. Link to project
supabase link --project-ref <project-id>

# 2. Initialize migrations
supabase db push

# 3. Verify
supabase db pull
```

- [ ] `supabase link` completed
- [ ] `supabase db push` succeeded
- [ ] No migration errors
- [ ] Database status shows "Ready"

### Option B: Manual SQL Execution

```bash
# In Supabase Dashboard > SQL Editor:
```

- [ ] Pasted `001_initial_schema.sql`
- [ ] Executed successfully (no errors)
- [ ] Pasted `002_seed_data.sql`
- [ ] Executed successfully (no errors)
- [ ] Pasted `003_functions_and_helpers.sql`
- [ ] Executed successfully (no errors)

## Post-Deployment Verification

### Schema Verification

```sql
-- Verify tables created
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should return: 28
```

- [ ] 28 tables created
- [ ] All table names match documentation
- [ ] Primary keys exist on all tables

### Data Verification

```sql
-- Verify seed data
SELECT COUNT(*) FROM services;      -- Should be 18
SELECT COUNT(*) FROM plans;          -- Should be 6
SELECT COUNT(*) FROM formation_modules; -- Should be 14
SELECT COUNT(*) FROM salon_config;  -- Should be 10+
```

- [ ] 18 services created
- [ ] 6 subscription plans created
- [ ] 14 training modules created
- [ ] Salon configuration seeded

### Index Verification

```sql
-- Verify indexes
SELECT COUNT(*) as index_count 
FROM pg_stat_user_indexes;
-- Should be 50+
```

- [ ] 50+ indexes created
- [ ] All critical columns indexed
- [ ] No duplicate indexes

### Function Verification

```sql
-- Test a function
SELECT user_has_role('some-uuid'::UUID, 'client');
SELECT COUNT(*) FROM get_partner_metrics('some-uuid'::UUID, 30);
```

- [ ] Functions callable without errors
- [ ] Return types correct
- [ ] No SQL syntax errors

### View Verification

```sql
-- Test materialized views
SELECT COUNT(*) FROM monthly_revenue_summary;
SELECT COUNT(*) FROM partner_leaderboard;
SELECT COUNT(*) FROM top_services_view;
SELECT COUNT(*) FROM client_subscription_status;
```

- [ ] All 4 materialized views exist
- [ ] Views query successfully
- [ ] View indexes created

### RLS Policy Verification

```sql
-- Check RLS policies
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE tablename IN ('users', 'clients', 'partenaires', 'rendez_vous');
-- Should be 15+
```

- [ ] 15+ RLS policies created
- [ ] Policies on correct tables
- [ ] No policy syntax errors

## Integration Testing

### Authentication
- [ ] Supabase Auth configured
- [ ] Phone OTP working
- [ ] JWT tokens valid

### Application Connection
- [ ] Frontend connects to Supabase
- [ ] Queries execute successfully
- [ ] RLS policies enforced correctly

### Sample Operations
- [ ] Can create user
- [ ] Can create client profile
- [ ] Can book appointment
- [ ] Can update appointment status
- [ ] Can record review
- [ ] Can process payout

## Environment Configuration

### .env Variables
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxx...
```

- [ ] `VITE_SUPABASE_URL` set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` set correctly
- [ ] Environment file not committed to git
- [ ] `.env.example` updated with variable names

### Backend Services
- [ ] Stripe API keys configured (if using payments)
- [ ] Twilio API keys configured (if using SMS)
- [ ] Firebase keys configured (if using notifications)

## Performance Tuning

### Query Performance
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;
```

- [ ] No queries exceeding 1s average
- [ ] EXPLAIN ANALYZE run on complex queries
- [ ] Missing indexes identified and added

### Connection Pooling
- [ ] Supabase connection pooling enabled
- [ ] Pool size appropriate for traffic
- [ ] Connection timeouts configured

## Security Hardening

### Row Level Security
- [ ] All tables have RLS enabled
- [ ] Policies tested and verified
- [ ] Admin bypass configured
- [ ] User isolation enforced

### Data Protection
- [ ] Sensitive fields identified
- [ ] Backup strategy implemented
- [ ] Encryption at rest enabled
- [ ] SSL/TLS in transit enforced

### Access Control
- [ ] Service role key protected
- [ ] Anon key restrictions configured
- [ ] API key rotation policy set
- [ ] Audit logging enabled

## Monitoring Setup

### Database Monitoring
- [ ] Query performance monitoring active
- [ ] Slow query log enabled
- [ ] Connection monitoring configured
- [ ] Storage monitoring enabled

### Application Monitoring
- [ ] Error tracking configured (Sentry/etc)
- [ ] Performance monitoring enabled
- [ ] User analytics configured
- [ ] Uptime monitoring enabled

## Backup & Disaster Recovery

### Backup Strategy
- [ ] Daily automated backups enabled
- [ ] Weekly manual backups scheduled
- [ ] Backup retention set to 30 days minimum
- [ ] Backup encryption enabled

### Recovery Testing
- [ ] Backup restore procedure documented
- [ ] Test restore performed
- [ ] RTO < 1 hour target set
- [ ] RPO < 1 hour target set

## Documentation Updates

- [ ] Architecture diagram updated
- [ ] API documentation updated
- [ ] Database schema documented
- [ ] Deployment guide written
- [ ] Troubleshooting guide created
- [ ] Team notified of changes

## Go-Live Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] No outstanding bugs
- [ ] Performance acceptable
- [ ] Security review completed
- [ ] Load testing completed

### Launch
- [ ] Maintenance window scheduled
- [ ] Rollback plan documented
- [ ] Team on standby
- [ ] Monitoring dashboard open
- [ ] Communication plan ready

### Post-Launch
- [ ] Monitor error rates (< 0.1%)
- [ ] Monitor performance metrics
- [ ] Check user reports
- [ ] Verify data integrity
- [ ] Document any issues

## Ongoing Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor query performance
- [ ] Verify data freshness

### Weekly
- [ ] Analyze table statistics
- [ ] Review slow query log
- [ ] Check backup completion

### Monthly
- [ ] Refresh materialized views
- [ ] Analyze index usage
- [ ] Review security logs
- [ ] Update documentation

## Rollback Plan

If issues occur:

1. [ ] Stop application traffic
2. [ ] Restore from latest backup
3. [ ] Verify data integrity
4. [ ] Notify users
5. [ ] Document incident
6. [ ] Root cause analysis
7. [ ] Implement fix
8. [ ] Re-test thoroughly
9. [ ] Resume operations

## Sign-Off

- [ ] Database Admin: _________________ Date: _______
- [ ] Application Lead: ________________ Date: _______
- [ ] Security Officer: ________________ Date: _______
- [ ] Operations Lead: _________________ Date: _______

## Notes

```
Space for deployment notes, issues encountered, and resolutions:

[Notes go here]
```

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Reviewed By**: _______________

For questions, refer to:
- Technical Documentation: `README.md`
- Quick Reference: `QUICK_REFERENCE.md`
- Migration Summary: `MIGRATION_SUMMARY.md`
