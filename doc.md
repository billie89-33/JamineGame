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
---

## 5. 🚀 Feature Development Workflow Pattern (มาตรฐานการสร้างฟีเจอร์)

ขั้นตอนการทำงานมาตรฐาน (Standard Operating Procedure) เมื่อต้องการสร้าง 1 Feature ใหม่ในโปรเจกต์ เพื่อให้การพัฒนาเป็นระบบ คลีน และจบงานได้อย่างสมบูรณ์

### Step 1: 🎨 สร้าง UI & Frontend Skeleton
เริ่มต้นจากฝั่งที่ User มองเห็น เพื่อกำหนดขอบเขตและ Data ที่จำเป็นต้องใช้
1. สร้าง UI Component หรือหน้า Page ในโฟลเดอร์ฝั่ง rontend
2. วางโครง Mock Data ชั่วคราว (ถ้าจำเป็น) เพื่อจัด Layout
3. ออกแบบว่า UI นี้ต้องการรับ-ส่ง Data รูปแบบไหน (ใช้เป็นแกนในการไปทำ API)

### Step 2: 🗄️ จัดการ Database Schema (Prisma)
เมื่อรู้แล้วว่า UI ต้องการข้อมูลอะไร ให้กลับมาทำโครงสร้างหลังบ้าน
1. ไปที่ ackend/prisma/schema.prisma
2. เพิ่มหรืออัปเดต Model ให้สอดคล้องกับ Requirement
3. รันคำสั่ง 
px prisma format และ 
px prisma generate
4. รัน Migration (เช่น 
px prisma migrate dev --name add_new_feature)

### Step 3: ⚙️ สร้าง Backend API (NestJS)
สร้างท่อส่งข้อมูลเพื่อเชื่อม Database กับ UI
1. ใช้ CLI สร้าง Module (หรือสร้างไฟล์เอง): Controller, Service, Module
2. สร้างและแชร์ DTO (Data Transfer Object) ในโฟลเดอร์ @shared/dto เพื่อให้ Type ตรงกันทั้งหน้าบ้าน-หลังบ้าน (อย่าลืมรัน build ฝั่ง shared)
3. เขียน Logic ใน Service และเปิด Endpoint ใน Controller

### Step 4: ⚡ ทดสอบ API ด้วยไฟล์ .http (REST Client)
ก่อนเอาไปต่อหน้าบ้าน ต้องเทสหลังบ้านให้ชัวร์ก่อน
1. ไปที่ไฟล์ pi.http ที่ Root ของโปรเจกต์
2. เขียน Request เส้นใหม่ที่เพิ่งสร้างขึ้นมา
3. กดยิงทดสอบ (เช็คเรื่อง Auth Token, Error Handling และ Data ที่คืนกลับมา)

### Step 5: 🔗 เชื่อม Frontend เข้ากับ Backend API
เอาหน้าบ้านที่สร้างไว้ใน Step 1 มาต่อกับของจริง
1. สร้างไฟล์ API Client (เช่น eature.api.ts ในฝั่ง Frontend)
2. เรียกใช้ DTO ที่แชร์มาจาก @shared/dto
3. ผูก API เข้ากับ UI (จัดการ State Loading, Error, และ Success)

### Step 6: 🧪 บังคับทำ Unit Test (Crucial Step!)
**⚠️ ทวงถามและบังคับตัวเองเสมอ:** "เทสแล้วหรือยัง?"
1. กลับไปที่ฝั่ง Backend
2. สร้างไฟล์ *.spec.ts (เช่น eature.service.spec.ts, eature.controller.spec.ts)
3. จำลอง (Mock) Prisma Service หรือ Dependencies ต่างๆ
4. รัน 
pm run test -w backend และต้องมั่นใจว่าไม่มี Error (Pass 100%)

---

## 🤖 คำสั่งสำหรับ AI (Prompt Instruction)
เมื่อให้ AI ช่วยสร้าง Feature ใหม่ ให้แนบคำสั่งนี้ต่อท้ายเสมอ:
> *"ช่วยสร้างฟีเจอร์ [ชื่อฟีเจอร์] โดยทำตามมาตรฐานข้อ 5. Feature Development Workflow ในไฟล์ doc.md ค่อยๆ ทำทีละสเต็ป เริ่มจาก UI -> Schema -> API -> ไฟล์ .http และสุดท้าย**ต้องบังคับให้ผม/คุณทำ Unit test** เสมอ"*
