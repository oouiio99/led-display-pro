# LED Display Pro

แปลงรูปภาพเป็นโค้ด HTML — หน้าจอ LED Display Pro แบบ Neon / Synthwave สร้างด้วย Lovable

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d867684f-f63f-4d90-be0a-24f4c4f98a9b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## วิธี่รันบนเครื่องตัวเอง

ต้องมี Node.js เวอร์ชัน 20 ขึ้นไปก่อน (ดาวน์โหลดได้ที่ https://nodejs.org)

**ถ้าดาวน์โหลดเป็น ZIP:** แตกไฟล์ แล้วเปิด Terminal (หรือ PowerShell) ในโฟลเดอร์นั้น แล้วรัน:

```sh
npm install
npm run dev
```

จากนั้นเปิดเบราว์เซอร์ที่ http://localhost:5173

**ถ้าใช้ bun:** รัน `bun install` แล้ว `bun run dev`

**ถ้า sync จาก GitHub:**

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

## Deploy ขึ้น Vercel

Sync repo กับ Vercel แล้วกด **Redeploy** หนึ่งครั้ง — เวอร์ชัน `@tanstack/react-start` ที่ใช้ (1.168.60) ถูกpatch แล้ว จึงไม่ต้องตั้งค่า `DANGEROUSLY_DEPLOY_VULNERABLE_TANSTACK_START_XSS`
