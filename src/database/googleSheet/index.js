const { JWT } = require("google-auth-library")
const { GoogleSpreadsheet } = require("google-spreadsheet")

module.exports = class GoogleSheet {
  constructor(
    _token = "1RTJFmyNgfNg_hkZ1xnNcjioYFUh6vbWuVpGTGdoYsTU",
    _index = 0
  ) {
    this.token = _token;
    this.index = _index;
  }

  async init() {
    const service = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    //init docs
    const docs = new GoogleSpreadsheet(this.token, service);
    await docs.loadInfo();
    
    this.docs = docs;

    //init sheet
    const sheet = docs.sheetsByIndex[this.index];
    this.sheet = sheet;

    const rows = await sheet.getRows();
    this.rows = rows;
  }

  find(KEY, VALUE) {
    const data = this.findAll();
    const response = data.filter((item) => {
      let match = false;
      for (const [key, value] of Object.entries(item)) {
        if (key === KEY) {
          if (value === VALUE) {
            match = true;
          }
        }
      }
      return match;
    });
    if (!response[0]) return null;
    return response;
  }

  findAll() {
    const data = [];
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      const Headers = row._worksheet.headerValues;
      const loop = {};
      for (let i2 = 0; i2 < Headers.length; i2++) {
        const header = Headers[i2];
        let value = row.get(header);
        if (value === "" || !value) {
          value = "-";
        }
        const Mapping = new Map([[header, value]]);
        const obj = Object.fromEntries(Mapping);
        Object.assign(loop, obj);
      }
      data.push(loop);
    }
    return data;
  }

  async create(rows) {
    const sheet = this.sheet;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      await sheet.addRow(row);
    }
  }

  async update(KEY, KEY_VALUE, NEW_VALUE) {
    const rows = this.rows;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.get(KEY) === KEY_VALUE) {
        row.assign(NEW_VALUE);
        await row.save();
        break;
      }
    }
  }

  async delete(KEY, KEY_VALUE) {
    const rows = this.rows;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.get(KEY) === KEY_VALUE) {
        await row.delete();
        break;
      }
    }
  }
}
