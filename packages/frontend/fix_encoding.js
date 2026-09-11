const fs = require('fs');
let content = fs.readFileSync('src/components/common/AdminLayout/AdminLayoutClient.tsx', 'utf-8');
content = content.replace(/const menuItems = \[.*?\];/s, `const menuItems = [
  { name: 'แดชบอร์ด', href: '/admin', icon: LayoutDashboard },
  { name: 'จัดการข่าวเกม', href: '/admin/articles', icon: FileText },
  { name: 'จัดการข้อมูลเกม', href: '/admin/games', icon: Gamepad2 },
  { name: 'จัดการหมวดหมู่', href: '/admin/categories', icon: Layers },
  { name: 'จัดการผู้ใช้งาน', href: '/admin/users', icon: Users },
  { name: 'ตั้งค่าระบบ', href: '/admin/settings', icon: Settings },
];`);
fs.writeFileSync('src/components/common/AdminLayout/AdminLayoutClient.tsx', content, 'utf-8');
