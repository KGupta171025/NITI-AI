# DATA INTEGRITY & AUDIT REPORT

**Auditor**: Database & Systems Integrity Engineer  
**Date**: September 23, 2026  
**Scope**: Client storage, database collections, uniqueness rules, and duplicate detection.

---

## 1. Audit Summary

| Entity | Duplicate Count | Orphan Count | Storage Medium | Integrity Risk | Mitigation Applied / Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Users** | 0 | 0 | Firebase Auth | Low | Governed by unique Firebase `uid` & unique email constraint in Firebase Auth. |
| **Profiles** | 0 | 0 | `localStorage` (`profile_${uid}`) | Medium | Local storage is scoped per `uid`. Multi-device sync requires cloud table with `UNIQUE(user_id)`. |
| **Locations** | 0 | 0 | Nested in profile | Low | Stored as embedded JSON coordinates with valid latitude `[-90..90]` and longitude `[-180..180]`. |
| **Schemes** | 0 | 0 | Static Types | Low | Need canonical `slug` and `id` primary keys to prevent duplicate scheme entries during ingestion. |
| **Saved Schemes** | 0 | 0 | Not yet created | N/A | Must enforce `UNIQUE(user_id, scheme_id)` set to prevent duplicate saves. |
| **Chat Sessions** | 0 | 0 | Not yet created | N/A | Must enforce stable session UUIDs and message timestamps. |

---

## 2. Uniqueness & Schema Rules for Implementation

When persistent cloud storage is connected, the following relational constraints are required:

```sql
-- Core Accounts Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,               -- Firebase UID
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    photo_url TEXT,
    role TEXT DEFAULT 'entrepreneur',
    is_onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entrepreneur Business Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,          -- 1:1 with users.id
    full_name TEXT NOT NULL,
    age INTEGER CHECK(age >= 18 AND age <= 120),
    gender TEXT,
    education TEXT,
    occupation TEXT,
    annual_income INTEGER,
    area_type TEXT,
    social_category TEXT,
    preferred_language TEXT DEFAULT 'en',
    business_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    sector TEXT NOT NULL,
    business_stage TEXT NOT NULL,
    enterprise_type TEXT NOT NULL,
    employee_count INTEGER DEFAULT 0,
    annual_turnover INTEGER DEFAULT 0,
    funding_required INTEGER DEFAULT 0,
    funding_purpose TEXT NOT NULL,
    udyam_number TEXT,
    gstin TEXT,
    latitude REAL CHECK(latitude >= -90.0 AND latitude <= 90.0),
    longitude REAL CHECK(longitude >= -180.0 AND longitude <= 180.0),
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    completion_percentage INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Saved Schemes Bookmarks Table
CREATE TABLE IF NOT EXISTS saved_schemes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    scheme_id TEXT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, scheme_id),        -- Prevents duplicate bookmarks
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
