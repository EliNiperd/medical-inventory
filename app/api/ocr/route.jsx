import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { withMonitoring } from '@/app/lib/withMonitoring';

export async function handler(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    const start = process.hrtime.bigint();
    const cpuStart = process.cpuUsage();

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Check file size (e.g., max 5MB)
    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    // Guardar la imagen en un archivo temporal
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Convertir a JPEG para evitar problemas con HEIC/WebP
    //const jpegBuffer = await sharp(buffer).jpeg().toBuffer();

    const processedBuffer = await sharp(buffer)
      .rotate() // corrige orientación según metadatos EXIF
      .resize(600) // reduce tamaño para acelerar OCR
      .grayscale() // opcional: mejora contraste
      .normalize() // mejora contraste
      //.threshold(180) // binariza, elimina ruido de fondo
      .toBuffer();

    //const tempPath = path.join("/public/temp", file.name);
    //const ext = path.extname(file.name) || '.jpg';
    //const tempPath = path.join(process.cwd(), 'public', 'temp', `upload-${Date.now()}${ext}`);
    /*const tempPath = path.join(
    'proyectos/medical-inventory/public/temp',
    `upload-${Date.now()}${ext}`
  );
  */
    //console.log(tempPath);

    //await writeFile(tempPath, processedBuffer);

    // Procesar la imagen con Tesseract
    const { data } = await Tesseract.recognize(processedBuffer, 'spa+eng', {
      tessedit_pageseg_mode: Tesseract.SPARSE_TEXT,
      //tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // opcional: restringir caracteres
      //logger: (m) => console.log(m), // (opcional)Mostrar mensajes de progreso en la consola
    });

    // Eliminar el archivo temporal
    //await unlink(tempPath);

    const end = process.hrtime.bigint();
    const cpuEnd = process.cpuUsage(cpuStart);
    const mem = process.memoryUsage();

    return NextResponse.json({
      text: data.text,
      confidence: data.confidence,
      //lines: data.lines.map((l) => l.text),
      durationMs: Number(end - start) / 1_000_000,
      cpu: {
        user: cpuEnd.user / 1000,
        system: cpuEnd.system / 1000,
      },
      memory: {
        rss: mem.rss / 1024 / 1024,
        heapUsed: mem.heapUsed / 1024 / 1024,
      },
    });
  } catch (error) {
    console.error('OCR processing failed:', error);
    return NextResponse.json({ error: 'OCR processing failed' }, { status: 500 });
  }
}

// 👇 Aquí aplicas el middleware
export const POST = withMonitoring(handler, '/api/ocr');
