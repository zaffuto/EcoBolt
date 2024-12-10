'use client'; // Directiva "use client" para marcar este archivo como componente del cliente

import QRCode from 'qrcode';
import { useState } from 'react';

// Componente del cliente
export default function SearchClient() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Función para generar el código QR
  const generateQRCode = async (discount: string, phone: string) => {
    const qrData = `Descuento: ${discount}, Contacto: ${phone}`;
    const url = await QRCode.toDataURL(qrData);
    setQrCodeUrl(url);
  };

  return (
    <div className="mb-4">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => generateQRCode('20% Descuento', '+56912345678')}
      >
        Generar QR para descuento
      </button>
      {qrCodeUrl && (
        <div className="mt-4">
          <img src={qrCodeUrl} alt="Código QR de descuento" className="mb-4" />
          <p className="text-lg">Envíalo a tu celular para compartirlo por WhatsApp.</p>
        </div>
      )}
    </div>
  );
}