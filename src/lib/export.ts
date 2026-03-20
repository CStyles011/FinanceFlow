import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Account, Category, Transaction } from '@/types';
import { formatDate } from '@/lib/utils';

export function exportTransactionsToCsv(
  transactions: Transaction[],
  categories: Category[],
  accounts: Account[],
) {
  const header = ['Descricao', 'Tipo', 'Valor', 'Categoria', 'Conta', 'Data', 'Observacao'];
  const rows = transactions.map((transaction) => {
    const category = categories.find((item) => item.id === transaction.categoryId)?.name ?? 'Sem categoria';
    const account = accounts.find((item) => item.id === transaction.accountId)?.name ?? 'Sem conta';

    return [
      transaction.description,
      transaction.type,
      transaction.amount.toFixed(2).replace('.', ','),
      category,
      account,
      formatDate(transaction.date),
      transaction.note.replaceAll(';', ',')
    ];
  });

  const csv = [header, ...rows].map((line) => line.join(';')).join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'financeflow-transacoes.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportElementToPdf(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#091020'
  });

  const imageData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * (pdfWidth - 20)) / canvas.width;

  pdf.setFontSize(18);
  pdf.text('FinanceFlow - Relatorio Financeiro', 14, 18);
  pdf.setFontSize(10);
  pdf.text(
    `Gerado em ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())}`,
    14,
    24,
  );
  pdf.addImage(imageData, 'PNG', 10, 30, pdfWidth - 20, Math.min(pdfHeight, 250));
  pdf.save(fileName);
}
