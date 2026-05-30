const SHEET_NAME = 'Inscrições';

const HEADERS = [
  'Enviado em',
  'Lote',
  'Nome da criança',
  'Idade',
  'Nome do responsável',
  'WhatsApp',
  'Igreja ou convidado',
  'Restrição alimentar',
  'Observações',
  'Autorização',
  'ID da inscrição',
  'Link de pagamento',
];

function doPost(event) {
  const sheet = getSheet();
  const data = event.parameter;

  ensureHeaders(sheet);

  sheet.appendRow([
    data.enviado_em || new Date(),
    data.lote || '',
    data.nome_crianca || '',
    data.idade || '',
    data.nome_responsavel || '',
    data.whatsapp || '',
    data.convidado_por || '',
    data.restricao_alimentar || '',
    data.observacoes || '',
    data.autorizacao || '',
    data.inscricao_id || '',
    data.link_pagamento || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Rota de inscrições ativa.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) {
    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const missingHeaders = HEADERS.filter((header) => !currentHeaders.includes(header));

    if (missingHeaders.length > 0) {
      sheet
        .getRange(1, currentHeaders.length + 1, 1, missingHeaders.length)
        .setValues([missingHeaders])
        .setFontWeight('bold');
    }

    return;
  }

  sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}
