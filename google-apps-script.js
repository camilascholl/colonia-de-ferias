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
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}
