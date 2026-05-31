import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export function downloadBlob(blob: Blob, fileName: string) {
  saveAs(blob, fileName);
}

export function downloadURL(url: string, fileName: string) {
  saveAs(url, fileName);
}

export async function downloadAllAsZip(
  files: { name: string; blob: Blob }[],
  zipName: string
) {
  const zip = new JSZip();
  
  files.forEach((file) => {
    zip.file(file.name, file.blob);
  });
  
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${zipName}.zip`);
}
