# Security Considerations for SIAM JUIT CLI App

## Production Security Guidelines

### 🔐 Database Security

#### Row Level Security (RLS)
- **Always enable RLS** on the `selected_students` table
- Create restrictive policies that only allow necessary operations
- Test policies thoroughly before production deployment

```sql
-- Enable RLS (REQUIRED)
ALTER TABLE selected_students ENABLE ROW LEVEL SECURITY;

-- Allow only SELECT operations for anonymous users
CREATE POLICY "Public read only" ON selected_students
FOR SELECT TO anon USING (true);

-- Explicitly deny all other operations
CREATE POLICY "No anonymous insert" ON selected_students FOR INSERT TO anon USING (false);
CREATE POLICY "No anonymous update" ON selected_students FOR UPDATE TO anon USING (false);  
CREATE POLICY "No anonymous delete" ON selected_students FOR DELETE TO anon USING (false);
```

#### Key Management
- ✅ **Use anon key** for client-side read operations
- ❌ **Never expose service role key** in client code
- 🔑 Store service role keys securely in Edge Functions only
- 🔄 Rotate keys periodically

### 🚦 Rate Limiting & Abuse Prevention

#### Client-Side Protections
```typescript
// Implement basic rate limiting
const lastCheck = localStorage.getItem('lastSelectionCheck');
const now = Date.now();
const cooldownPeriod = 30000; // 30 seconds

if (lastCheck && now - parseInt(lastCheck) < cooldownPeriod) {
  throw new Error('Please wait before checking again');
}

localStorage.setItem('lastSelectionCheck', now.toString());
```

#### Recommended: Edge Function Rate Limiting
```typescript
// In Supabase Edge Function
const rateLimitKey = `rate_limit:${clientIP}`;
const requests = await redis.incr(rateLimitKey);

if (requests === 1) {
  await redis.expire(rateLimitKey, 60); // 1 minute window
}

if (requests > 10) { // Max 10 requests per minute
  return new Response('Rate limit exceeded', { status: 429 });
}
```

### 🛡️ Data Protection

#### Email Handling
- **Normalize emails**: Always convert to lowercase and trim
- **No logging**: Never log email addresses in client or server logs
- **No analytics**: Don't send emails to third-party services
- **Hash for logs**: If logging is necessary, hash emails first

```typescript
// Safe email handling
const sanitizeEmail = (email: string) => {
  return email.toLowerCase().trim();
};

// For logging (if absolutely necessary)
const hashEmail = async (email: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
```

#### Privacy Compliance
- Display minimal information about selection status
- Don't reveal why someone wasn't selected
- Implement data retention policies
- Consider GDPR/privacy law requirements

### 🌐 Network Security

#### HTTPS Only
- **Enforce HTTPS** in production
- Use secure cookie flags
- Implement Content Security Policy (CSP)

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

#### API Security
- Validate all inputs on both client and server
- Use parameterized queries (Supabase handles this)
- Implement proper error handling without information disclosure

### 🔍 Monitoring & Auditing

#### Security Monitoring
```typescript
// Log security events (without sensitive data)
const logSecurityEvent = (event: string, metadata?: Record<string, any>) => {
  console.log(`[SECURITY] ${event}`, {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent.substring(0, 100),
    ...metadata
  });
};

// Usage
logSecurityEvent('SELECTION_CHECK_ATTEMPT', { 
  emailDomain: email.split('@')[1],
  success: result.selected 
});
```

#### Error Handling
```typescript
// Safe error responses
const handleSelectionError = (error: unknown) => {
  // Log full error server-side
  console.error('Selection check error:', error);
  
  // Return generic message to client
  return {
    selected: false,
    error: 'Unable to check selection status. Please try again later.'
  };
};
```

### 🏗️ Production Architecture Recommendations

#### Option 1: Edge Function Architecture (Recommended)
```
Client → Edge Function → Supabase Database
```

**Benefits:**
- Server-side validation and rate limiting
- API key security
- Better error handling
- Audit logging capabilities

#### Option 2: Direct Client Access (Basic)
```
Client → Supabase Database (with RLS)
```

**Requirements:**
- Strict RLS policies
- Client-side rate limiting
- Minimal data exposure

### 🚨 Security Checklist

#### Pre-Deployment
- [ ] RLS enabled on all tables
- [ ] Service role key not in client code
- [ ] Rate limiting implemented  
- [ ] Input validation in place
- [ ] Error messages don't leak information
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Email handling sanitized

#### Post-Deployment
- [ ] Monitor for unusual access patterns
- [ ] Regular security audits
- [ ] Key rotation schedule
- [ ] Backup and disaster recovery plans
- [ ] Incident response procedures

### 🔧 Security Testing

#### Test Cases
1. **SQL Injection**: Attempt malicious SQL in email field
2. **Rate Limiting**: Rapid successive requests
3. **Data Enumeration**: Systematic email checking
4. **Error Information**: Analyze error messages for data leaks
5. **Network Security**: Verify HTTPS enforcement

#### Tools
- OWASP ZAP for web security testing
- Burp Suite for API testing
- Browser developer tools for client-side security

### 📞 Incident Response

#### If Security Breach Suspected
1. **Immediate**: Rotate Supabase keys
2. **Assessment**: Check access logs for unusual activity
3. **Containment**: Implement additional rate limiting
4. **Investigation**: Analyze attack vectors
5. **Recovery**: Restore secure state
6. **Prevention**: Update security measures

#### Contact Information
- Supabase Support: support@supabase.io
- Security Team: [Your institution's security contact]

### 🔄 Regular Maintenance

#### Monthly Tasks
- Review access logs
- Check for failed authentication attempts
- Update dependencies
- Test security measures

#### Quarterly Tasks
- Rotate API keys
- Security audit
- Update security policies
- Staff security training

---

**Remember**: Security is an ongoing process, not a one-time setup. Regularly review and update security measures as threats evolve.