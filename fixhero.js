const fs = require('fs'); const h = fs.readFileSync('src/components/Hero.jsx','utf8'); const lines = h.split('\n'); console.log('Lines:', lines.length); lines.slice(-10).forEach((l,i)=,l)); 
