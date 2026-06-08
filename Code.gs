const SECRET_TOKEN = "bsft_alert_9x2k"; // keep this private

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    // Reject requests without valid token
    if (data._token !== SECRET_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ result: "unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    delete data._token;
    // ... rest of your code
