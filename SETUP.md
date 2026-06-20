# Quantix Studio - Setup Guide

Complete onboarding guide for developers joining the Quantix Studio project.

---

## 📋 Prerequisites

- **Node.js** 20.x or **Bun** 1.0+
- **Git** for version control
- **Supabase account** with a new project for this copy
- Modern browser (Chrome, Firefox, Safari, Edge)

---

## 🔧 Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd quantix-studio
```

### 2. Install Dependencies

```bash
nvm use
npm install
# or
bun install
```

### 3. Configure Environment Variables

```bash
# Copy template
cp .env.example .env

# Edit .env and add your credentials
nano .env  # or use your preferred editor
```

**Get your Supabase credentials:**
1. Go to: `https://supabase.com/dashboard/project/<your-new-project-ref>/settings/api`
2. Copy **Project URL** → `VITE_SUPABASE_URL`
3. Copy **anon/public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Copy **Project Reference** → `VITE_SUPABASE_PROJECT_ID`
5. Update `supabase/config.toml` with the same project reference before using the Supabase CLI.

### 4. Start Development Server

```bash
npm run dev
# or
bun run dev
```

App will be available at: `http://127.0.0.1:3000`

Important:

- Open the exact URL above in the browser
- Do not open bare `http://127.0.0.1/` because nothing is served on port `80`
- If `npm run dev` fails because port `3000` is busy, inspect the conflicting process:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

---

## Supabase Configuration

### Apply migrations to the new project

Use the Supabase CLI after you create and link the new project:

```bash
supabase link --project-ref <your-new-project-ref>
supabase db push
```

If you do not use the CLI, apply the SQL files in `supabase/migrations/` to the new project in timestamp order.

### Disable Email Confirmation (Development Only)

For faster testing during development:

1. Open: `https://supabase.com/dashboard/project/<your-new-project-ref>/auth/providers`
2. Scroll to **Email** provider
3. Toggle **OFF**: "Confirm email"
4. Click **Save**

Important: re-enable this for production.

---

## Verify Your Setup

### Method 1: Browser Console Test

After starting the app and logging in:

```javascript
// Open browser console (F12) and run:
testSupabase()
```

This will check:
- ✅ Database connection
- ✅ Authentication status
- ✅ RLS policies
- ✅ Role system (RBAC)
- ✅ Security configuration

### Method 2: Manual Verification

1. **Sign Up**: Create new account at `/auth`
2. **Check Database**:
   - Go to `https://supabase.com/dashboard/project/<your-new-project-ref>/editor`
   - Verify new row in `profiles` table
   - Verify new row in `user_roles` table with role='user'
3. **Test Profile**: Navigate to `/profile` and update your name
4. **Test Theme**: Toggle dark/light mode in header

---

## 🏗️ Architecture Overview

### Database Schema

```
┌─────────────┐      ┌──────────────┐
│  auth.users │──┬──→│   profiles   │
└─────────────┘  │   └──────────────┘
                 │   │ id (uuid)    │
                 │   │ email        │
                 │   │ full_name    │
                 │   │ created_at   │
                 │   └──────────────┘
                 │
                 └──→┌──────────────┐
                     │  user_roles  │
                     └──────────────┘
                     │ id (uuid)    │
                     │ user_id      │
                     │ role (enum)  │
                     └──────────────┘
```

### Role System (RBAC)

**Roles (app_role enum):**
- `admin` — Full system access
- `moderator` — Limited admin capabilities
- `user` — Standard user (default)

**How it works:**
1. User signs up → Trigger creates profile AND assigns 'user' role
2. Role checks use `has_role(user_id, role)` security definer function
3. RLS policies use `has_role()` to enforce permissions
4. Only admins can modify roles in `user_roles` table

**❌ Never check roles client-side:**
```typescript
// WRONG: Client-side role check (easily bypassed)
if (localStorage.getItem('role') === 'admin') { ... }

// CORRECT: Server-side RLS policy
const { data } = await supabase
  .rpc('has_role', { _user_id: user.id, _role: 'admin' });
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch user profile"

**Cause:** RLS policies not enabled or user not authenticated

**Fix:**
1. Verify you're logged in (check session in DevTools → Application → Local Storage)
2. Check RLS is enabled in the Auth and Table policy screens for the new Supabase project.

---

### Issue: "Cannot update profile"

**Cause:** Trying to update another user's profile

**Fix:** Users can only update their own profile. Check that `auth.uid() = profile.id`

---

### Issue: "Role not found"

**Cause:** `user_roles` entry not created on signup

**Fix:**
1. Verify trigger exists: `on_auth_user_created_role` on `auth.users`
2. Manually insert role:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('your-user-id', 'user'::app_role);
   ```

---

### Issue: Environment variables not loading

**Cause:** `.env` file missing or incorrect variable names

**Fix:**
1. Ensure `.env` exists in project root
2. All client-side vars must start with `VITE_`
3. Restart dev server after changing `.env`

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] `.env` is in `.gitignore` (verify with `git status`)
- [ ] No sensitive data in client-side code
- [ ] Email confirmation is **enabled** in Supabase
- [ ] RLS enabled on all tables with user data
- [ ] Role checks use `has_role()` security definer function
- [ ] All API routes validate authentication
- [ ] CORS configured properly for your domain

---

## 📚 Additional Resources

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Row Level Security (RLS) Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Lovable Documentation](https://docs.lovable.dev)
- [React Router v6 Docs](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Run type check: `npm run build`
4. Test authentication flows (signup, login, logout)
5. Verify RLS policies work correctly
6. Commit with clear message
7. Push and create pull request

**Never commit:**
- `.env` file
- `node_modules/`
- Build artifacts (`dist/`)
- Personal API keys or secrets

---

## 📞 Support

Need help? Check the project documentation or reach out to the development team.

---

**Last Updated:** 2025-10-12  
**Version:** 1.0.0  
**Maintainer:** Quantix Studio Team
