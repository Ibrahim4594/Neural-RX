import { jsPDF } from "jspdf";
import type { ConversationMessage } from "@shared/schema";

export function exportChatAsText(messages: ConversationMessage[]): void {
  const content = messages
    .map((msg) => {
      const timestamp = new Date(msg.timestamp).toLocaleString();
      const role = msg.role === "user" ? "You" : "MediSearch AI";
      return `[${timestamp}] ${role}:\n${msg.content}\n`;
    })
    .join("\n---\n\n");

  const header = `MediSearch AI - Chat History\nExported: ${new Date().toLocaleString()}\n\n${"=".repeat(60)}\n\n`;
  const fullContent = header + content;

  const blob = new Blob([fullContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `medisearch-chat-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportChatAsPDF(messages: ConversationMessage[]): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("MediSearch AI", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("Powered by Elastic + Google Gemini", margin, yPosition);
  yPosition += 5;

  doc.setTextColor(150);
  doc.text(`Exported: ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += 10;

  // Separator line
  doc.setDrawColor(200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Messages
  doc.setTextColor(0);

  messages.forEach((msg, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    // Timestamp
    doc.setFontSize(8);
    doc.setTextColor(120);
    const timestamp = new Date(msg.timestamp).toLocaleString();
    doc.text(timestamp, margin, yPosition);
    yPosition += 5;

    // Role
    doc.setFontSize(11);
    if (msg.role === "user") {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(14, 165, 233); // Medical blue
      doc.text("You:", margin, yPosition);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139); // Gray
      doc.text("MediSearch AI:", margin, yPosition);
    }
    yPosition += 6;

    // Message content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);

    const lines = doc.splitTextToSize(msg.content, maxWidth);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 8;

    // Separator
    if (index < messages.length - 1) {
      doc.setDrawColor(230);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
    }
  });

  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "This information is for educational purposes. Always consult a healthcare professional.",
    margin,
    pageHeight - 10
  );

  doc.save(`medisearch-chat-${Date.now()}.pdf`);
}

export function exportChatAsJSON(messages: ConversationMessage[]): void {
  const exportData = {
    exportDate: new Date().toISOString(),
    application: "MediSearch AI",
    version: "1.0",
    messageCount: messages.length,
    messages: messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      searchResults: msg.searchResults || [],
    })),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `medisearch-chat-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
