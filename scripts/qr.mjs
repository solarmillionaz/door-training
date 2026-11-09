import QRCode from 'qrcode';
const url = 'https://solarmillionaz.github.io/door-training/';
await QRCode.toFile('deliverables/door-training-qr.png', url, { errorCorrectionLevel: 'H', margin: 4, width: 1200, color: { dark: '#000000', light: '#FFFFFF' } });
await QRCode.toFile('public/qr.png', url, { errorCorrectionLevel: 'H', margin: 4, width: 1200, color: { dark: '#000000', light: '#FFFFFF' } });
console.log('ok');
