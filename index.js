const { startNgrok, getNgrokUrl } = require('./config');
require('dotenv').config();

const ngrokProcess = startNgrok();

setTimeout(async () => {
  try {
    const publicUrl = await getNgrokUrl();
    console.log(`กำลังรันการทดสอบด้วย URL: ${publicUrl}`);
    
    require('./test');
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
    process.exit(1);
  }
}, 5000);

process.on('SIGINT', () => {
  console.log('กำลังปิดโปรแกรม...');
  if (ngrokProcess) {
    ngrokProcess.kill();
  }
  process.exit(0);
});