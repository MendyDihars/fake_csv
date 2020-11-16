const { v4: uuid } = require('uuid');
const moment = require('moment');
const { LoremIpsum } = require('lorem-ipsum');
const randomEmail = require('random-email');
const Papa = require('papaparse');
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const randInt = (n = 10000) =>
  Math.floor(Math.random() * n)

const randRef = () => {
  const elements = require('./ref/' + (args.ref || "tardis") + ".json");

  return elements[randInt(elements.length)];
}

const tooLongString = () => {
  let str = [];
  for (let i = 0; i < 5; i++) {
    str.push(lorem.generateSentences(1));
  }
  return str.join (' ');
}

const randURL = type => {
  let url = "https://";
  url += (
    uuid().replace('-', '').substr(0, 10)
    + (type === "img" ? ".fr/image.jpg" : ".com")
  );
  return url;
}


const badLine = () => {
  const fields = require('./config/' + (args.config || "tardis") + ".json");
  let line = generateLine();
  fields.forEach(field => {
    let data;
    switch (field.type) {
      case "unicity":
        data = uuid();
        break;
      case "text":
        data = tooLongString();
        break;
      case "string":
        data = "";
        break;
      case "int":
        data = "Chiffre";
        break;
      case "float":
        data = 46811.258;
        break;
      case "money":
        data = 930154125540456.901;
        break;
      case "datetime":
        data = moment().subtract(randInt(500), 'days').format('DD-MM-YYYY');
        break;
      case "boolean":
        data = "Schrodinger";
        break;
      case "email":
        data = "moiarobasegmailpointcom";
        break;
      case "phone":
        data = `666`;
        break;
      case "postcode":
        data = `h3r3`;
        break;
      case "enum":
        data = "Aligator";
        break;
      case "url":
        data = "perdu.com";
        break;
      case "image":
        data = "image.jpeg";
        break;
    }
    if (Math.random() > 0.5) {
      line[field.value] = data;
    }
  })
  return line;
}

const generateLine = () => {
  let n = parseFloat(`${randInt(100000)}.${randInt(999)}`);
  let date = moment().subtract(randInt(500), 'days');
  const fields = require('./config/' + (args.config || 'tardis')  + ".json");
  let line = {};
  fields.forEach(field => {
    let data;
    switch (field.type) {
      case "unicity":
        data = uuid();
        break;
      case "text":
        data = lorem.generateSentences(1);
        break;
      case "string":
        data = lorem.generateSentences(1).substr(0, 10);
        break;
      case "int":
        data = randInt(field.max || null);
        break;
      case "float":
        data = `${randInt(50000)}.${randInt(99)}`;
        break;
      case "money":
        data = Math.random() > 0.5 ? n : -Math.abs(n);
        break;
      case "datetime":
        data = date.format('YYYY-MM-DDTHH:mm:ss') + (date.isDST() ? '+02:00': '+01:00');
        break;
      case "boolean":
        data = Math.random() >= 0.5;
        break;
      case "email":
        data = randomEmail({ domain: 'np6.com' });
        break;
      case "phone":
        data = `+336${randInt(89) + 10}${randInt(89) + 10}${randInt(89) + 10}${randInt(89) + 10}`;
        break;
      case "postcode":
        data = `${randInt(83) + 10}${randInt(10) + 10}0`;
        break;
      case "enum":
        data = randRef();
        break;
      case "url":
        data = randURL();
        break;
      case "image":
        data = randURL('img');
        break;
    }
    line[field.value] = data;
  })
  return line;
}
const appendFile = (path, data) =>
  new Promise((resolve, reject) => {
    fs.appendFile(path, data, err => {
      if (err) reject(err);
      resolve();
    })
  })

const removeFile = path =>
  new Promise((resolve, reject) => {
    fs.exists(path, (isExists) => {
      if (isExists) {
        fs.unlink(path, e => {
          if (e) reject(e);
          resolve();
        })
      } else {
        resolve();
      }
    })
  })

const writeLines = (path, lines, header = false) =>
  new Promise((resolve, reject) => {
    appendFile(path, Papa.unparse(lines, {
      delimiter: '|',
      header,
      // quotes: true,
      // quoteChar: '"',
      newline: '\r\n'
    }) + '\r\n')
      .then(resolve)
      .catch(reject)
  })

const run = async () => {
  const COUNT = 3000, INCREMENT = 500;
  let path = args.filepath || 'C:\\Users\\mdihars\\Documents\\WORKSPACE\\FILES\\result.csv';
  console.log('path', path)
  await removeFile(path);
  let lines = [];
  for (let i = 0; i < COUNT; i++) {
    // let line = generateLine();
    let line = Math.random() > 0.15 ? generateLine() : badLine();
    lines.push(line);
    if (i === 0) {
      await writeLines(path, lines, true);
      lines = [];
    }
    if (lines.length === INCREMENT) {
      await writeLines(path, lines);
      console.log('--> ', i)
      lines = [];
    }
  }
  if (lines.length) {
    await writeLines(path, lines);
  }
}

run();