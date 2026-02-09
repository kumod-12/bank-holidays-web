# Managing Legal & Static Pages

This guide explains how to manage legal pages (About Us, Privacy Policy, Terms & Conditions, etc.) on your website.

## Overview

Legal pages are managed through **Payload CMS** and rendered dynamically by Next.js. This gives you a powerful admin interface to edit content without touching code.

## Quick Start

### 1. Access the Admin Panel

Visit: **http://localhost:4000/admin/collections/pages**

Login with your admin credentials.

### 2. View Existing Pages

You'll see 6 default pages already created:

- **About Us** (`/about-us`)
- **Privacy Policy** (`/privacy-policy`)
- **Terms & Conditions** (`/terms-conditions`)
- **Cookie Policy** (`/cookie-policy`)
- **Disclaimer** (`/disclaimer`)
- **Contact Us** (`/contact-us`)

### 3. Edit a Page

1. Click on any page to open the editor
2. Modify the content using the rich text editor
3. Update meta information for SEO
4. Click **Save** at the top right

## Page Fields Explained

### Basic Information

- **Title** (required): The page heading (e.g., "About Us")
- **Slug** (required): The URL path (e.g., "about-us" → `/about-us`)
  - Must be lowercase with hyphens only
  - Should be unique

### Content

- **Content** (required): Main page content
  - Supports rich text formatting:
    - Headings (H2, H3)
    - Bold, italic, underline
    - Bullet lists and numbered lists
    - Links
  - Click the format buttons in the editor toolbar

### SEO Settings

- **Meta Title**: Custom SEO title (defaults to page title if empty)
  - Recommended: 50-60 characters
  - Shows in Google search results

- **Meta Description**: SEO description
  - Recommended: 150-160 characters
  - Shows in Google search results

### Footer Settings

- **Show in Footer**: Toggle to display page link in footer
- **Footer Section**: Choose which footer section to display in:
  - Quick Links
  - Legal
  - Resources

### Publishing

- **Published**: Toggle to hide/show page from public
  - Unpublished pages return 404 error

## Creating a New Page

### Via Admin Panel (Recommended)

1. Go to: http://localhost:4000/admin/collections/pages
2. Click **Create New Page** button
3. Fill in all required fields:
   - Title
   - Slug (lowercase, hyphens only)
   - Content
4. Optionally set:
   - Meta Title & Description
   - Footer display settings
5. Click **Save**

### Via Code (Advanced)

If you need to programmatically create pages, use the MongoDB API:

```bash
cd /Users/kumudmehta/claude-projects/bank-holidays-payload
npm run create-pages
```

This runs the script that creates default pages. You can modify `scripts/create-default-pages.ts` to add your own pages.

## Editing Page Content

### Rich Text Editor Features

**Headings:**
- H2 for main sections
- H3 for subsections
- Don't use H1 (it's the page title)

**Lists:**
- Bullet lists for unordered items
- Numbered lists for step-by-step content

**Links:**
1. Select the text
2. Click the link icon
3. Enter the URL
4. Choose "Open in new tab" if external link

**Formatting:**
- **Bold** for emphasis
- *Italic* for slight emphasis
- Underline sparingly

### Example Content Structure

```
[Page Title - H1, auto-generated]

Introduction paragraph explaining the page.

## Main Section (H2)

Content about this section.

### Subsection (H3)

More detailed information.

- Bullet point 1
- Bullet point 2
- Bullet point 3

## Another Section (H2)

More content here.
```

## SEO Best Practices

### Meta Titles

✅ Good examples:
- "About Us | My Holiday Calendar"
- "Privacy Policy | My Holiday Calendar"
- "Contact Us - My Holiday Calendar"

❌ Avoid:
- Too long: "About Us and Our Mission to Provide the Best Holiday Information..."
- No branding: "About Us"
- Keyword stuffing: "About Us Holiday Calendar Bank Holidays..."

### Meta Descriptions

✅ Good example:
```
Learn about My Holiday Calendar - your trusted source for bank holidays
and public holidays worldwide. Accurate, up-to-date information you can rely on.
```

❌ Avoid:
- Too short: "About us"
- Too long: (Over 160 characters gets cut off)
- Duplicate descriptions across multiple pages

### URL Slugs

✅ Good slugs:
- `about-us`
- `privacy-policy`
- `terms-conditions`
- `cookie-policy`

❌ Bad slugs:
- `About Us` (spaces)
- `about_us` (underscores)
- `aboutUs` (camelCase)
- `ABOUT-US` (uppercase)

## Common Tasks

### Update Privacy Policy

1. Go to: http://localhost:4000/admin/collections/pages
2. Click on "Privacy Policy"
3. Update the "Last updated" date in the content
4. Modify any sections that changed
5. Click **Save**

### Add New Legal Page

Example: Adding a "Refund Policy" page

1. Click **Create New Page**
2. Fill in:
   - Title: `Refund Policy`
   - Slug: `refund-policy`
   - Content: Write your refund policy
   - Meta Title: `Refund Policy | My Holiday Calendar`
   - Meta Description: `Learn about our refund policy...`
   - Show in Footer: ✓ (checked)
   - Footer Section: `Legal`
3. Click **Save**

The page is now live at `/refund-policy`

### Change Footer Links

The footer links are managed through the **Footer collection**:

1. Go to: http://localhost:4000/admin/collections/footer
2. Edit the active footer configuration
3. Modify the sections and links
4. Click **Save**

Alternatively, use the page's "Show in Footer" toggle to automatically add/remove links.

## Technical Details

### File Locations

**Backend (Payload CMS):**
- Collection: `/Users/kumudmehta/claude-projects/bank-holidays-payload/src/collections/Pages.ts`
- Scripts: `/Users/kumudmehta/claude-projects/bank-holidays-payload/scripts/create-default-pages.ts`

**Frontend (Next.js):**
- Page component: `/Users/kumudmehta/claude-projects/bank-holidays-web/app/[slug]/page.tsx`
- API function: `/Users/kumudmehta/claude-projects/bank-holidays-web/lib/api.ts` (getPageBySlug)
- Types: `/Users/kumudmehta/claude-projects/bank-holidays-web/lib/types.ts` (Page interface)

### Database

Pages are stored in MongoDB:
- Collection: `pages`
- Database: `bank-holidays`

### Caching

Pages are cached for **24 hours** (86400 seconds). To force a refresh:

1. Edit the page in admin panel
2. Click Save (this updates the `updatedAt` timestamp)
3. Clear your browser cache if needed

## Troubleshooting

### Page Not Found (404)

**Possible causes:**

1. **Page not published**
   - Solution: Go to admin panel → Edit page → Check "Published" → Save

2. **Wrong slug**
   - Solution: Verify slug matches URL (e.g., `/about-us` needs slug `about-us`)

3. **Cache issue**
   - Solution: Wait 24 hours or restart dev server

4. **Database not connected**
   - Solution: Check backend server is running on port 4000

### Content Not Updating

1. Check if you saved the page in admin panel
2. Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Wait for cache to expire (24 hours) or restart dev server

### Rich Text Not Rendering

1. Check if content field is filled in admin panel
2. Verify no JavaScript errors in browser console
3. Check that `slateToHtml` utility is working

## API Reference

### Fetch Page by Slug

```typescript
import { getPageBySlug } from '@/lib/api';

const page = await getPageBySlug('about-us');

if (page) {
  console.log(page.title); // "About Us"
  console.log(page.content); // Slate rich text array
}
```

### Page Type

```typescript
interface Page {
  id: string;
  title: string;
  slug: string;
  content: SlateContent[];
  metaTitle?: string;
  metaDescription?: string;
  showInFooter?: boolean;
  footerSection?: 'quick-links' | 'legal' | 'resources';
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Support

If you need help:

1. Check this documentation first
2. Review the Payload CMS documentation: https://payloadcms.com/docs
3. Check the browser console for errors
4. Verify backend server is running: `curl http://localhost:4000/api/pages`

## Summary

✅ **To update legal pages**: Use Payload admin panel at http://localhost:4000/admin/collections/pages

✅ **To create new pages**: Click "Create New Page" in admin panel

✅ **To edit footer links**: Either use the Footer collection or toggle "Show in Footer" on each page

✅ **URL format**: All pages are accessible at `/{slug}` (e.g., `/about-us`, `/privacy-policy`)

That's it! You now have a fully functional page management system. 🎉
