import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const formData = new FormData();
formData.append('file', fs.createReadStream('C:\\Users\\Admin\\Desktop\\pneumonia2.png'));

formData.getLength((err, length) => {
  if (err) {
    console.error('Length error:', err);
    return;
  }

  const headers = { ...formData.getHeaders(), 'Content-Length': length };

  console.log('Sending request with headers:', headers);

  axios.post('https://m7-code-pneumofusion.hf.space/predict', formData, {
    headers,
    timeout: 30000,
  })
    .then((res) => console.log('SUCCESS:', res.data.prediction, res.data.confidence))
    .catch((err) => console.error('FAILED:', err.message));
});