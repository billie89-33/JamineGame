# 🔄 Git & Development Workflow

เอกสารนี้อธิบายถึงขั้นตอนและมาตรฐานการทำงาน (Workflow) สำหรับโปรเจกต์นี้ เพื่อให้การพัฒนาซอฟต์แวร์เป็นระเบียบ ปลอดภัย และง่ายต่อการดูแลรักษาในระยะยาว โดยอ้างอิงจากรูปแบบ **Feature Branch Workflow**

---

## 1. การตั้งชื่อ Branch (Branching Strategy)
ห้ามทำการ Commit และ Push โค้ดตรงเข้าสู่กิ่ง `main` โดยเด็ดขาด ทุกงานจะต้องถูกแยกออกเป็น Branch ย่อยตามประเภทของงาน:

- **`feat/`** : สำหรับฟีเจอร์ใหม่ (เช่น `feat/dynamic-category`, `feat/card-hover`)
- **`fix/`** : สำหรับแก้บั๊กหรือปัญหาการทำงาน (เช่น `fix/image-upload`, `fix/navbar-mobile`)
- **`refactor/`** : สำหรับการปรับปรุงโค้ดให้ดีขึ้นโดยที่ฟังก์ชันยังเหมือนเดิม (เช่น `refactor/api-structure`)
- **`docs/`** : สำหรับแก้ไขหรือเขียนเอกสาร (เช่น `docs/update-workflow`)

---

## 2. การ Commit (Commit Message Convention)
ข้อความ Commit ควรมีความหมายและบอกได้ว่าทำอะไรไป โดยใช้รูปแบบ [Conventional Commits](https://www.conventionalcommits.org/):

**ตัวอย่าง:**
- `feat: เพิ่มฟิลด์ Video URL ในระบบจัดการบทความ`
- `fix: แก้ไข API คืนค่า URL รูปภาพไม่ถูกต้อง`
- `style: ปรับปรุงหน้าตา Dashboard เป็นภาษาไทย`

---

## 3. นโยบายการเขียนเทส (Testing Policy)
เพื่อให้ความเร็วในการพัฒนาสมดุลกับคุณภาพของระบบ เราจะแบ่งความสำคัญของการเขียน Test ดังนี้:

- 🟢 **UI & Frontend Layout:** 
  - **ไม่ต้องเขียนเทสอัตโนมัติ** ให้ใช้การตรวจสอบด้วยตา (Manual Testing) เพื่อความรวดเร็ว
- 🟡 **Business Logic / Helper Functions:** 
  - แนะนำให้เขียน **Unit Test** สำหรับฟังก์ชันคำนวณหรือตัวช่วยจัดการข้อมูล (เช่น การจัดรูปแบบวันที่, คำนวณราคา)
- 🔴 **Core API & Security (Login, Payment, Upload):** 
  - **ต้องเขียนเทส** (Integration/E2E Test) เพื่อป้องกันความเสียหายเมื่อมีการอัปเดตระบบในอนาคต

---

## 4. ขั้นตอนการทำงานจริง (Step-by-Step)

1. **ดึงโค้ดล่าสุดจากเซิร์ฟเวอร์:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **สร้าง Branch ใหม่สำหรับเริ่มงาน:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **เขียนโค้ดและทำการ Commit (สามารถทำได้หลายครั้ง):**
   ```bash
   git add .
   git commit -m "feat: อธิบายสิ่งที่ทำ"
   ```
4. **Push โค้ดขึ้นไปที่ Repository:**
   ```bash
   git push origin feat/your-feature-name
   ```
5. **เปิด Pull Request (PR):**
   - ไปที่ระบบจัดการ (เช่น GitHub) เพื่อเปิด PR
   - รีวิวโค้ดและตรวจสอบว่าไม่มีข้อผิดพลาด
6. **รวมโค้ดและลบ Branch (Merge & Delete):**
   - เมื่ออนุมัติ ให้กด Merge รวมเข้า `main`
   - ลบ Branch ทิ้งเพื่อไม่ให้รกรุงรัง
