# Full-Stack Architecture: Next.js + NestJS + Supabase (PostgreSQL)

เอกสารนี้อธิบายโครงสร้างสถาปัตยกรรมและ Folder Structure สำหรับโปรเจกต์ Full-Stack ที่ประกอบด้วย:
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **Database**: Supabase (PostgreSQL) เชื่อมต่อผ่าน Prisma ORM

---

## 1. ภาพรวมสถาปัตยกรรม (Architecture Overview)

```mermaid
graph LR
    A[Next.js Frontend] -->|HTTP / REST API| B[NestJS Backend]
    B -->|Prisma ORM| C[(Supabase PostgreSQL)]
    A -.->|Supabase Auth (Optional)| C
```

- **Frontend (Next.js)**: รับผิดชอบส่วนติดต่อผู้ใช้งาน จัดการ UI/UX โดยใช้ Server Components และ Client Components แยกส่วนกันชัดเจน ไม่เก็บ Business Logic หลักไว้ที่นี่
- **Backend (NestJS)**: เป็นตัวกลางประมวลผล Business Logic หลัก จัดการ Security, Validation และ Authorization ใช้ Layered Architecture
- **Database (Supabase)**: ใช้ประโยชน์จาก PostgreSQL โดยเชื่อมต่อจาก NestJS เป็นหลัก (อาจใช้ Supabase SDK ใน Next.js เสริมกรณีจัดการ Authentication)

---

## 2. โครงสร้างโฟลเดอร์ฝั่ง Frontend (Next.js)

ใช้ Next.js App Router และแยกโฟลเดอร์ตาม Best Practice

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Route Group สำหรับหน้า Login/Register
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/        # Route Group สำหรับหน้า Dashboard
│   │   ├── layout.tsx          # Root Layout
│   │   ├── page.tsx            # Home Page
│   │   └── globals.css         # Global Styles
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── ui/                 # UI พื้นฐาน (เช่น Button, Input)
│   │   ├── common/             # Component ที่ใช้บ่อย (เช่น Navbar, Footer)
│   │   └── features/           # Component ที่ผูกกับฟีเจอร์เฉพาะ
│   │
│   ├── features/               # แยก Business Logic และ State ตามฟีเจอร์
│   │   ├── auth/               # จัดการเรื่อง Auth
│   │   ├── users/
│   │   └── products/
│   │
│   ├── hooks/                  # Custom React Hooks
│   ├── lib/                    # Utility Functions และการตั้งค่าต่างๆ
│   │   ├── api/                # Axios/Fetch client สำหรับเรียก NestJS
│   │   ├── utils/              # Helper functions
│   │   └── constants/          # ตัวแปร Constants
│   │
│   ├── types/                  # TypeScript Interfaces / Types
│   └── config/                 # ค่า Configuration ของแอปพลิเคชัน
│
├── public/                     # Static Assets (รูปภาพ, ไอคอน)
├── tailwind.config.ts          # ตั้งค่า Tailwind CSS
├── tsconfig.json               # ตั้งค่า TypeScript
└── package.json
```

---

## 3. โครงสร้างโฟลเดอร์ฝั่ง Backend (NestJS)

ใช้ Layered Architecture / Feature Modules เพื่อความง่ายในการดูแลรักษา และเชื่อมต่อ Supabase ด้วย Prisma

```text
backend/
├── prisma/                     # การตั้งค่า Database และ Prisma Schema
│   ├── schema.prisma           # โครงสร้างตาราง (Models) ที่จะ Sync กับ Supabase
│   └── migrations/             # ไฟล์ประวัติการแก้ Database Schema
│
├── src/
│   ├── main.ts                 # Entry point (ตั้งค่า CORS, Validation, Security)
│   ├── app.module.ts           # Root Module
│   │
│   ├── common/                 # ส่วนกลางที่ใช้ร่วมกันทั้งโปรเจกต์
│   │   ├── decorators/         # Custom Decorators (เช่น @GetUser)
│   │   ├── filters/            # Exception Filters (จัดการ Error Responses)
│   │   ├── guards/             # Authentication & Roles Guards
│   │   ├── interceptors/       # Logging & Transform Interceptors
│   │   └── dto/                # Global DTOs (เช่น Pagination)
│   │
│   ├── config/                 # โฟลเดอร์จัดการ Environment Variables (เช่น joi, zod)
│   │
│   └── modules/                # แยกการทำงานตาม Domain/ฟีเจอร์
│       ├── auth/               # ระบบ Login / JWT
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.module.ts
│       │
│       ├── users/              # ระบบจัดการ User
│       │   ├── controllers/    # รับ HTTP Request & Response
│       │   ├── services/       # Business Logic หลัก
│       │   ├── repositories/   # (Optional) เรียกใช้ Prisma
│       │   ├── dto/            # Data Transfer Objects
│       │   ├── entities/       # (Optional) Class ตัวแทนของข้อมูล
│       │   └── users.module.ts
│       │
│       └── prisma/             # Prisma Module สำหรับให้ Module อื่นเรียกใช้ Database
│           ├── prisma.service.ts
│           └── prisma.module.ts
│
├── .env                        # เก็บ DATABASE_URL เชื่อมไปยัง Supabase
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## 4. แนะนำแนวทางการพัฒนาเพิ่มเติม

1. **Database Migration**: ให้ใช้ Prisma Migration (`npx prisma migrate dev`) ในการจัดการโครงสร้างตารางของ Supabase PostgreSQL หลีกเลี่ยงการไปสร้างตารางแบบ Manual บนเว็บ Supabase
2. **Environment Variables**:
   - ทางฝั่ง NestJS ให้เก็บ `DATABASE_URL` (Connection string ของ Supabase)
   - ทางฝั่ง Next.js ให้เก็บ API URL ชี้ไปยัง NestJS (เช่น `NEXT_PUBLIC_API_URL=http://localhost:3000`)
3. **Authentication**: 
   - วิธีที่ 1: ใช้ NestJS จัดการ Auth ทั้งหมดผ่าน JWT แล้วให้ Next.js ส่ง HTTP-Only Cookies (เหมาะกับการเก็บ Logic ไว้ที่เดียว)
   - วิธีที่ 2: ใช้ Supabase Auth (Client) บน Next.js เลย แล้วส่ง JWT Access Token มาให้ NestJS ตรวจสอบความถูกต้องผ่าน Guard
4. **Validation**: ติดตั้ง `zod` หรือ `class-validator` ใน NestJS DTO เพื่อกรองข้อมูลที่ถูกส่งมาจาก Next.js เสมอ
