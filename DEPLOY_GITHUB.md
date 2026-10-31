# คู่มือการนำระบบ Linktree ขึ้น GitHub และเปิดออนไลน์ฟรี 24 ชม.

> **ข้อควรรู้สำคัญก่อนเริ่ม:**  
> ระบบนี้เป็น **Full-Stack Node.js (Express + Database)** มีระบบล็อกอิน, ฐานข้อมูล, และนับยอดคลิก  
> ตัว **GitHub Pages** จะรองรับเฉพาะเว็บ Static (HTML ล้วนไม่มีเซิร์ฟเวอร์)  
> ดังนั้นวิธีมาตรฐานสากลคือ: **เอาโค้ดขึ้น GitHub Repo** จากนั้นเชื่อมต่อไปรันบน **Render** (ฟรี 100%) เพื่อให้ได้ URL จริงออนไลน์ตลอดเวลา

---

## ขั้นตอนที่ 1: อัพโหลดโค้ดขึ้น GitHub

### วิธีที่ง่ายที่สุด: ใช้ GitHub Desktop (แนะนำ)
1. ดาวน์โหลดและติดตั้ง [GitHub Desktop](https://desktop.github.com/)
2. เปิดโปรแกรมแล้วล็อกอินด้วยบัญชี GitHub ของคุณ
3. ไปที่เมนู **File** -> **Add Local Repository...**
4. กด **Choose...** แล้วเลือกโฟลเดอร์โปรเจกต์:  
   `D:\KIM\BOT\ทำเว็ปลิ้งค์ Bio`
   *(หากโปรแกรมแจ้งเตือนว่ายังไม่ได้เป็น git repository ให้กดสร้าง repository)*
5. ในช่อง Commit summary ด้านล่างซ้าย พิมพ์ `Initial Linktree commit` แล้วกดปุ่ม **Commit to main**
6. กดปุ่ม **Publish repository** ด้านบน  
   - ตั้งชื่อ Repository เช่น `my-linktree`
   - ติ๊กเอาเครื่องหมายถูกออกจาก Keep this code private (หากต้องการให้เป็น Public)
   - กด **Publish Repository**

---

### หรือวิธีที่ 2: ใช้คำสั่ง Git ผ่าน Terminal (ถ้ามี Git ติดตั้งในเครื่อง)
เปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วรัน:
```bash
git init
git add .
git commit -m "Initial commit Linktree clone"
git branch -M main
git remote add origin https://github.com/ชื่อผู้ใช้ของคุณ/ชื่อ-repo-ของคุณ.git
git push -u origin main
```

---

## ขั้นตอนที่ 2: สั่งให้เว็บออนไลน์ฟรีด้วย Render.com

เมื่อโค้ดอยู่บน GitHub แล้ว ให้เราเชื่อมต่อกับ Render เพื่อให้เซิร์ฟเวอร์รันออนไลน์:

1. เข้าเว็บไซต์ [https://render.com](https://render.com) แล้วกด **Sign Up** ด้วยบัญชี **GitHub**
2. เมื่อเข้าหน้า Dashboard กดปุ่ม **New +** ที่มุมขวาบน แล้วเลือก **Web Service**
3. เลือก **Build and deploy from a Git repository** แล้วกด **Next**
4. จะเห็นรายชื่อ Repository ของคุณ ให้กดปุ่ม **Connect** ตรง repo `my-linktree`
5. กรอกข้อมูลการตั้งค่าเพียงเล็กน้อย:
   - **Name**: ตั้งชื่อเว็บของคุณ (เช่น `my-linktree-bio`)
   - **Region**: Singapore (ใกล้ไทย โหลดเร็วที่สุด)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: เลือก **Free** ($0/month)
6. เลื่อนลงมาล่างสุดแล้วกด **Create Web Service**
7. รอระบบบิลด์ประมาณ 1-2 นาที คุณจะได้ลิงก์ เช่น:  
   `https://my-linktree-bio.onrender.com`

---

## ขั้นตอนที่ 3: ใช้งานเว็บของคุณบนอินเทอร์เน็ต
- หน้าหลัก: `https://my-linktree-bio.onrender.com/`
- หน้าสร้าง/จัดการลิงก์: `https://my-linktree-bio.onrender.com/login`
- หน้า Bio สาธารณะสำหรับคนทั่วไป: `https://my-linktree-bio.onrender.com/ชื่อยูสเซอร์ของคุณ`
