# Fix Admin Dashboard Visibility

If you are unable to see complaints in the Admin Dashboard, it is likely because your user account does not have the `admin` role in the database. By default, new users are created as `citizen`.

To fix this, you need to manually promote your user to an admin in Supabase.

## Instructions

1.  Go to your **Supabase Dashboard**.
2.  Click on the **SQL Editor** icon in the left sidebar.
3.  Click **New Query**.
4.  Copy and paste the following SQL command:

```sql
-- Replace 'YOUR_EMAIL_HERE' with the email address you used to sign up
UPDATE public.profiles
SET role = 'admin', department = 'General Administration'
WHERE email = 'YOUR_EMAIL_HERE';
```

5.  Replace `YOUR_EMAIL_HERE` with your actual email address (e.g., `abhishek@example.com`).
6.  Click **Run**.

## Verify the Fix

1.  Go back to your application.
2.  Refresh the **Admin Dashboard** page.
3.  You should now see all registered complaints.

## Why is this happening?

The application uses **Row Level Security (RLS)** to protect data.
- **Citizens** can only see their *own* complaints.
- **Admins** can see *all* complaints.

If your user role is still set to `citizen` (the default), the database security policy prevents you from seeing other users' complaints, even if you are on the Admin Dashboard page.
