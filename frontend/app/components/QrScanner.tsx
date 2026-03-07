"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QrScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    return () => {
      const stopScanner = async () => {
        if (scannerRef.current) {
          try {
            if (scannerRef.current.isScanning) {
              await scannerRef.current.stop();
            }
            await scannerRef.current.clear();
          } catch {}
        }
      };

      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    setError("");

    try {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setResult(decodedText);
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      setError("Không mở được camera.  Hãy kiểm tra quyền truy cập camera hoặc thử bằng HTTPS.");
      console.error(err);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h2>Scan QR bằng camera</h2>

      <div
        id="reader"
        style={{
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: 12,
          overflow: "hidden",
        }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {!isScanning ? (
          <button onClick={startScanner}>Bật camera</button>
        ) : (
          <button onClick={stopScanner}>Tắt camera</button>
        )}
      </div>

      {result && (
        <div style={{ marginTop: 16 }}>
          <strong>Nội dung QR:</strong>
          <div
            style={{
              marginTop: 8,
              padding: 12,
              background: "#f5f5f5",
              borderRadius: 8,
              wordBreak: "break-word",
            }}
          >
            {result}
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>
          {error}
        </p>
      )}
    </div>
  );
}