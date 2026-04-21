import { PDFDocument, rgb, degrees } from 'pdf-lib';
import QRCode from 'qrcode';

interface WatermarkData {
    userId: string;
    docId: string;
    timestamp: string;
    deviceId?: string;
    userName?: string;
}

/**
 * Service for generating watermarked PDFs on the client side.
 */
export const WatermarkService = {
    /**
     * Generates a QR code as a data URL.
     */
    async generateQRCode(data: string): Promise<string> {
        try {
            return await QRCode.toDataURL(data, {
                margin: 1,
                width: 200,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });
        } catch (err) {
            console.error('QR Code generation failed:', err);
            return '';
        }
    },

    /**
     * Applies watermarks and protection layers to a PDF.
     */
    async applyProtection(pdfBuffer: ArrayBuffer, data: WatermarkData): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pages = pdfDoc.getPages();
        const qrCodeDataUrl = await this.generateQRCode(JSON.stringify({
            id: data.docId,
            u: data.userId,
            t: data.timestamp,
            v: '1.0'
        }));

        let qrImage: any;
        try {
            if (qrCodeDataUrl) {
                qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
            }
        } catch (e) {
            console.warn('Could not embed QR code, continuing without it:', e);
        }

        pages.forEach((page, index) => {
            try {
                const { width, height } = page.getSize();

                // 1. Diagonal microtext (Tiling) - Simplified to Latin to avoid pdf-lib encoding errors
                // Format: USR-001 | DOC-123 | 15.02.2025
                const dateOnly = data.timestamp.split(',')[0] || '';
                const watermarkText = `ID:${data.userId} | ${data.docId} | ${dateOnly}`;

                for (let x = -width; x < width * 2; x += 150) {
                    for (let y = -height; y < height * 2; y += 60) {
                        page.drawText(watermarkText, {
                            x,
                            y,
                            size: 8,
                            color: rgb(0.7, 0.75, 0.8),
                            opacity: 0.2,
                            rotate: degrees(45),
                        });
                    }
                }

                // 2. Rub-al-Hizb (Eight-pointed star) background pattern
                this.drawStarPattern(page, width, height);

                // 3. QR Code for verification
                if (qrImage) {
                    page.drawImage(qrImage, {
                        x: width - 75,
                        y: 25,
                        width: 55,
                        height: 55,
                        opacity: 0.4,
                    });
                }
            } catch (pageErr) {
                console.error(`Failed to watermark page ${index}:`, pageErr);
            }
        });

        return await pdfDoc.save();
    },

    /**
     * Draws a subtle Rub-al-Hizb pattern in the center.
     */
    drawStarPattern(page: any, width: number, height: number) {
        const centerX = width / 2;
        const centerY = height / 2;
        const size = 150;

        // Drawing two rotated squares to form a Rub-al-Hizb
        const drawSquare = (angle: number) => {
            const rad = (angle * Math.PI) / 180;
            const points = [
                { x: -size, y: -size },
                { x: size, y: -size },
                { x: size, y: size },
                { x: -size, y: size },
            ].map(p => ({
                x: centerX + (p.x * Math.cos(rad) - p.y * Math.sin(rad)),
                y: centerY + (p.x * Math.sin(rad) + p.y * Math.cos(rad)),
            }));

            for (let i = 0; i < 4; i++) {
                const next = (i + 1) % 4;
                page.drawLine({
                    start: points[i],
                    end: points[next],
                    thickness: 0.8, // Increased from 0.5
                    color: rgb(0.6, 0.7, 0.8), // Light blue-gray
                    opacity: 0.1, // Doubled from 0.05
                });
            }
        };

        drawSquare(0);
        drawSquare(45);
    },
};
