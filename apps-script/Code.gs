const SPREADSHEET_ID = '1wpr1ujSQpymp54pz2VhdW0pQHfxZ6lLxabCrIEw2EzU';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];

    if (sheet.getLastRow() === 0) {
      setupSheet(sheet);
    }

    const attendance = data.attendance === 'yes' ? 'Да' : 'Нет';

    sheet.appendRow([
      new Date(),
      data.name || '',
      attendance,
      data.guests || '',
      data.message || '',
      data.guestId || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('RSVP endpoint работает')
    .setMimeType(ContentService.MimeType.TEXT);
}

function setupSheet(sheet) {
  const target = sheet || SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  target.appendRow([
    'Дата и время',
    'Имя',
    'Присутствие',
    'Кол-во гостей',
    'Пожелания',
    'ID гостя',
  ]);
  target.getRange(1, 1, 1, 6).setFontWeight('bold');
}
