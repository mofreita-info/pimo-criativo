#!/usr/bin/env node

/**
 * Script: markdown-to-pdf.js
 * Converte arquivo Markdown para PDF usando jsPDF
 * 
 * Uso: node scripts/markdown-to-pdf.js <input.md> <output.pdf>
 */

import fs from "fs";
import path from "path";
import jsPDF from "jspdf";

// Simulação de markdown simples → PDF (sem parser complexo)
// Para produção, considere usar biblioteca como 'marked' ou 'markdown-it'

function markdownToPDF(inputPath, outputPath) {
  try {
    // Ler arquivo Markdown
    const markdownContent = fs.readFileSync(inputPath, "utf-8");

    // Criar documento PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // Configuração de fonte
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 6;
    const maxWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Função para adicionar texto com quebra automática
    const addWrappedText = (text, fontSize = 10, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold ? "bold" : "normal");

      const lines = doc.splitTextToSize(text, maxWidth);

      lines.forEach((line) => {
        if (yPosition > pageHeight - margin - lineHeight) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };

    // Parser simples de Markdown (apenas estrutura básica)
    const lines = markdownContent.split("\n");

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Ignorar linhas vazias (apenas incrementar espaço)
      if (!trimmedLine) {
        yPosition += lineHeight * 0.5;
        return;
      }

      // Títulos (# ## ###)
      if (trimmedLine.startsWith("# ")) {
        addWrappedText(trimmedLine.replace("# ", ""), 20, true);
        yPosition += lineHeight * 0.7;
      } else if (trimmedLine.startsWith("## ")) {
        addWrappedText(trimmedLine.replace("## ", ""), 16, true);
        yPosition += lineHeight * 0.5;
      } else if (trimmedLine.startsWith("### ")) {
        addWrappedText(trimmedLine.replace("### ", ""), 13, true);
        yPosition += lineHeight * 0.4;
      }
      // Linhas de código (começam com 4 espaços ou tab)
      else if (trimmedLine.startsWith("    ") || trimmedLine.startsWith("\t")) {
        doc.setFont(undefined, "normal");
        doc.setFontSize(9);
        addWrappedText(trimmedLine.trim(), 9);
      }
      // Listas (- ou *)
      else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        addWrappedText("  • " + trimmedLine.substring(2), 10);
      }
      // Texto normal
      else {
        addWrappedText(trimmedLine, 10);
      }
    });

    // Salvar PDF
    doc.save(outputPath);
    console.log(`✅ PDF gerado com sucesso: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao gerar PDF: ${error.message}`);
    return false;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("Uso: node scripts/markdown-to-pdf.js <input.md> <output.pdf>");
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1];

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Arquivo não encontrado: ${inputPath}`);
    process.exit(1);
  }

  const success = markdownToPDF(inputPath, outputPath);
  process.exit(success ? 0 : 1);
}

export { markdownToPDF };
