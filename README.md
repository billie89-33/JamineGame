# MyJamine (JamineGame) 🎮

MyJamine คือโปรเจกต์เว็บแอปพลิเคชัน Full-Stack ที่ทำหน้าที่เป็น **สารานุกรมเกม (Game Encyclopedia) และพอร์ทัลข่าวสารเกม** ระบบถูกออกแบบมาให้สามารถแยกเก็บข้อมูลเกม (เช่น ผู้พัฒนา, วันวางจำหน่าย, สเปคที่ต้องการ) และบทความเกี่ยวกับเกม (เช่น ข่าว, รีวิว, บทสรุป) ออกจากกันอย่างชัดเจน โดยบทความสามารถเชื่อมโยงกลับไปยังเกมที่เกี่ยวข้องได้

โปรเจกต์นี้ใช้สถาปัตยกรรมแบบ **Monorepo** เพื่อแชร์ Type/DTO ระหว่าง Frontend และ Backend ได้อย่างราบรื่น

---

## 🛠️ Tech Stack & Tools (เทคโนโลยีและเครื่องมือที่ใช้)

### Frontend (ฝั่งผู้ใช้งานและ Admin UI)
* **Framework:** Next.js 16 (App Router)
* **UI/Styling:** React 19, Tailwind CSS v4
* **Editor:** Tiptap (Rich Text Editor สำหรับเขียนบทความ)
* **Date & Icons:** date-fns, react-datepicker, Lucide React

### Backend (ฝั่งเซิร์ฟเวอร์และ API)
* **Framework:** NestJS 11
* **Database & ORM:** PostgreSQL (แนะนำให้ใช้ Supabase) และ Prisma ORM
* **Authentication:** JWT (JSON Web Token), Passport, bcrypt
* **File Uploads:** Cloudinary (สำหรับจัดการรูปภาพหน้าปกและรูปในบทความ)

### Shared & Infrastructure
* **Language:** TypeScript
* **Package Manager:** npm (npm workspaces สำหรับจัดการ Monorepo)
* **Validation:** class-validator, class-transformer

---

## ✨ Features (ฟีเจอร์หลัก)

* **Game Database:** ระบบจัดการฐานข้อมูลเกม แสดงรายละเอียดแพลตฟอร์ม, ผู้พัฒนา, และสเปคเครื่อง
* **Gaming Articles:** ระบบข่าวสาร รีวิว และไกด์เกม ที่เชื่อมโยงเข้ากับข้อมูลเกมโดยตรง
* **Admin Dashboard:** ระบบจัดการเนื้อหาหลังบ้าน (CMS) สำหรับเพิ่ม/แก้ไขเกมและบทความ
* **Rich Text Editing:** เครื่องมือสร้างบทความพร้อมรองรับการจัดรูปแบบและแนบรูปภาพ

---

## 🔒 Security & Architecture (ความปลอดภัยและสถาปัตยกรรม)

* **Authentication (JWT & Cookies):** 
  * ระบบล็อกอินใช้ **JWT (JSON Web Token)** ในการยืนยันตัวตน
  * เพื่อความปลอดภัยสูงสุด (ป้องกัน XSS) โทเคนจะถูกเก็บไว้ใน **HttpOnly Cookie** ผ่านฝั่ง Backend โดยตรง (ตั้งค่า `secure` ตาม Environment)
* **Authorization & Roles:**
  * มีการแบ่งสิทธิ์ผู้ใช้งานผ่านระบบ Role-Based Access Control (RBAC) เช่นสิทธิ์ `USER` และ `ADMIN`
  * มี Custom Decorator (`@Roles('ADMIN')`) ร่วมกับ `RolesGuard` ฝั่ง NestJS เพื่อป้องกัน API เส้นที่สงวนไว้ให้แอดมินเท่านั้น (เช่น การสร้างบทความ หรือแก้ไขข้อมูลเกม)
* **Image Management (Cloudinary):**
  * รูปภาพหน้าปกและรูปที่อัปโหลดผ่าน Editor จะถูกส่งไปเก็บที่ Cloudinary เพื่อลดภาระของเซิร์ฟเวอร์
* **Database Sync:**
  * ใช้ Prisma Schema เป็น Single Source of Truth และทำการ `prisma db push` (หรือ migrate) ไปยัง PostgreSQL

---

## 🚀 Getting Started (การติดตั้งและรันโปรเจกต์)

### สิ่งที่ต้องมีเบื้องต้น (Prerequisites)
* Node.js (v20 ขึ้นไป)
* PostgreSQL Database (เช่น Supabase)
* บัญชี Cloudinary (สำหรับการอัปโหลดรูปภาพ)

### ขั้นตอนการติดตั้ง

1. **โคลนโปรเจกต์ และติดตั้ง Dependencies**
   ```bash
   npm run install:all
   ```

2. **ตั้งค่า Environment Variables (`.env`)**
   * เข้าไปที่ `packages/backend` และสร้างไฟล์ `.env` (ระบุ `DATABASE_URL`, `JWT_SECRET`, ข้อมูล Cloudinary)
   * เข้าไปที่ `packages/frontend` และสร้างไฟล์ `.env` (ระบุ `NEXT_PUBLIC_API_URL` หรืออื่นๆ)

3. **เตรียมฐานข้อมูลและ Build Backend**
   ```bash
   npm run build:backend
   ```
   *(คำสั่งนี้จะทำการ generate Prisma Client และ build NestJS)*

4. **รันโปรเจกต์ (Development Mode)**
   เปิด Terminal 2 หน้าต่าง:
   * รัน Frontend: `npm run dev:frontend`
   * รัน Backend: `npm run dev:backend`

---

## 📂 Folder Structure (โครงสร้างโปรเจกต์)

โครงสร้างแบบ Monorepo ถูกแบ่งไว้ในโฟลเดอร์ `packages/` ดังนี้:

```text
MyJamine/
├── packages/
│   ├── frontend/             # Next.js Application (หน้าเว็บและแอดมิน)
│   │   ├── src/app/          # ระบบ Routing ของ Next.js
│   │   ├── src/components/   # React Components ต่างๆ
│   │   ├── src/features/     # แยก Logic/State ตามส่วนต่างๆ
│   │   └── package.json
│   │
│   ├── backend/              # NestJS Application (API Server)
│   │   ├── prisma/           # Schema ฐานข้อมูลและ Migrations
│   │   ├── src/modules/      # แยก API ตาม Domain (เช่น auth, users, games, articles)
│   │   └── package.json
│   │
│   └── shared/               # Shared Package สำหรับแชร์ระหว่างโค้ด 2 ฝั่ง
│       └── dto/              # TypeScript Interfaces, Enums และ DTOs
│
├── doc/                      # เอกสารสรุปการออกแบบ สถาปัตยกรรม และแผนงาน (Architecture)
├── package.json              # ไฟล์จัดการ Workspace ส่วนกลางและ Scripts หลัก
└── README.md                 # ไฟล์นี้ (ภาพรวมโปรเจกต์)
```
