import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})

export class PdfService {

  constructor() { }
  
  //exporto el seleccionado
  exportChartToPdf(chartCanvas: HTMLCanvasElement, fileName: string): void {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [297, 210]
    });

    this.addChartToPdf(pdf, chartCanvas);
    pdf.save(fileName);
  }

  // Exporto todos en una misma pagina
  exportMultipleChartsToPdf(chartCanvases: HTMLCanvasElement[], fileName: string): void {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [297, 210]
    });

    chartCanvases.forEach((canvas, index) => {
      if (index > 0) {
        pdf.addPage();
      }
      this.addChartToPdf(pdf, canvas);
    });

    pdf.save(fileName);
  }

  // Método interno para agregar un gráfico a un documento PDF
  private addChartToPdf(pdf: jsPDF, chartCanvas: HTMLCanvasElement): void {
    const imgData = chartCanvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  }
}
