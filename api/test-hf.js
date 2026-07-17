import axios from 'axios';

console.log('Testing HF Space connection...');

axios.get('https://m7-code-pneumofusion.hf.space/health', { timeout: 15000 })
  .then((res) => {
    console.log('SUCCESS:', res.data);
  })
  .catch((err) => {
    console.error('FAILED:', err.message);
    console.error('Code:', err.code);
  });