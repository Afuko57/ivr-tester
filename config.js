const dotenv = require('dotenv');
const { exec } = require('child_process');

dotenv.config();

const startNgrok = () => {
  const ngrokProcess = exec(`ngrok http ${process.env.LOCAL_SERVER_PORT || 8080}`);
  console.log(`Start ngrok ที่พอร์ต ${process.env.LOCAL_SERVER_PORT || 8080}`);
  
  ngrokProcess.stdout.on('data', (data) => {
    console.log(`ngrok: ${data}`);
  });
  
  ngrokProcess.stderr.on('data', (data) => {
    console.error(`ngrok error: ${data}`);
  });
  
  return ngrokProcess;
};

const getNgrokUrl = async () => {
  return new Promise((resolve, reject) => {
    exec('curl -s localhost:4040/api/tunnels', (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Error: ${stderr}`);
        return;
      }
      
      try {
        const tunnels = JSON.parse(stdout);
        const publicUrl = tunnels.tunnels[0].public_url;
        console.log(`URL คับเตง: ${publicUrl}`);
        process.env.PUBLIC_SERVER_URL = publicUrl;
        resolve(publicUrl);
      } catch (e) {
        reject(`Error parsing ngrok output: ${e.message}`);
      }
    });
  });
};

module.exports = {
  startNgrok,
  getNgrokUrl
};