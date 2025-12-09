# 💒 Bachelorette Party Availability Scheduler

A beautiful, mobile-friendly web app to coordinate availability for a bachelorette party across 15 participants. Built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- 📅 **Calendar Interface**: Easy Yes/No/Maybe selection for March 6-22, 2025 (17 days)
- 🔗 **Unique Links**: Each participant gets a unique link to view/edit their responses
- 📊 **Admin Dashboard**: Password-protected view to see all availability
- 🎯 **Smart Analysis**: Automatically highlights the best 4-day periods
- 📱 **Mobile-Friendly**: Fully responsive design
- 🎨 **Beautiful UI**: Fun, colorful theme perfect for a celebration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- A Vercel account (free tier works great)

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to the SQL Editor in your Supabase dashboard
4. Copy the contents of `supabase-schema.sql` and run it in the SQL editor
5. Go to Settings > API to find your project URL and anon key

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password-here
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 📦 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts and add your environment variables when asked

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
6. Click "Deploy"

### Important: Set Environment Variables in Vercel

After deployment, make sure to add your environment variables in the Vercel dashboard:

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add all three variables from your `.env.local` file
4. Redeploy if necessary

## 📖 User Guide

### For Participants

1. Visit the app homepage
2. Enter your name
3. Select Yes/No/Maybe for each date in March 6-22, 2025
4. Submit and save your unique link
5. Use your unique link to edit your availability anytime

### For the Organizer (Admin)

1. Visit `/admin` on your deployed site
2. Enter the admin password (set in environment variables)
3. View the full availability grid
4. Check the "Best 4-Day Periods" section to see optimal dates
5. The periods are scored based on:
   - Yes votes: +3 points
   - Maybe votes: +1 point
   - No votes: -0.5 points

## 🗂️ Project Structure

```
BachSched/
├── app/
│   ├── admin/          # Admin dashboard page
│   ├── confirmation/   # Confirmation page after submission
│   ├── schedule/       # Calendar interface for selecting dates
│   ├── globals.css     # Global styles with Tailwind
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── components/
│   └── CalendarGrid.tsx # Reusable calendar component
├── lib/
│   ├── dates.ts        # Date utility functions
│   └── supabase.ts     # Supabase client configuration
├── supabase-schema.sql # Database schema
├── .env.example        # Environment variables template
└── README.md          # This file
```

## 🗄️ Database Schema

### Tables

**participants**
- `id` (UUID, primary key)
- `name` (TEXT)
- `unique_id` (TEXT, unique)
- `submission_timestamp` (TIMESTAMPTZ)
- `last_updated` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

**availability**
- `id` (UUID, primary key)
- `participant_id` (UUID, foreign key)
- `date` (DATE)
- `status` (TEXT: 'yes', 'no', or 'maybe')
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## 🎨 Customization

### Change Date Range

Edit `lib/dates.ts`:
```typescript
export const START_DATE = new Date('2025-03-06');
export const END_DATE = new Date('2025-03-22');
```

### Change Theme Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  'party-pink': '#FF69B4',
  'party-purple': '#9D4EDD',
  'party-gold': '#FFD700',
  'party-rose': '#FF1493',
}
```

### Change Admin Password

Update `NEXT_PUBLIC_ADMIN_PASSWORD` in your `.env.local` and Vercel environment variables.

## 🔒 Security Notes

- The admin password is stored as an environment variable
- Row Level Security (RLS) is enabled in Supabase
- Each participant can only access their data via their unique link
- For production, consider moving the admin password check to a server-side API route

## 🐛 Troubleshooting

### "Failed to create your profile"
- Check that your Supabase URL and key are correct in `.env.local`
- Verify that the database schema was created successfully
- Check the browser console for detailed error messages

### Admin dashboard shows no data
- Ensure participants have submitted their availability
- Check Supabase dashboard to verify data exists
- Verify environment variables are set correctly

### Styling looks broken
- Run `npm install` to ensure all dependencies are installed
- Clear your `.next` folder and rebuild: `rm -rf .next && npm run dev`

## 📝 License

MIT License - feel free to use this for your own events!

## 🎉 Credits

Built with love for coordinating the perfect bachelorette party! 💕

---

**Need help?** Check the [Next.js Documentation](https://nextjs.org/docs) or [Supabase Documentation](https://supabase.com/docs)
