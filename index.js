const { v4: uuid } = require('uuid');
const moment = require('moment');
const { LoremIpsum } = require('lorem-ipsum');
const randomEmail = require('random-email');
const Papa = require('papaparse');
const fs = require('fs');

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

const badLine = () => {
  let line = generateLine();
  if (Math.random() > 0.5) {
    line.numero_gagnant = lorem.generateSentences(1);
  }
  if (Math.random() > 0.5) {
    line.taille_approximative = 46811.258;
  }
  if (Math.random() > 0.5) {
    line.solde_souhaite = 930154125540456.901;
  }
  if (Math.random() > 0.5) {
    line.jour_j = moment().subtract(randInt(500), 'days').format('DD-MM-YYYY');
  }
  if (Math.random() > 0.5) {
    line.hamlet = "zozo";
  }
  if (Math.random() > 0.5) {
    line.email = "Moi";
  }
  if (Math.random() > 0.5) {
    line.phone = "654789";
  }
  if (Math.random() > 0.5) {
    line.la_casa = "300001";
  }
  return line;
}

const generateLine = () => {
  let n = parseFloat(`${randInt(100000)}.${randInt(999)}`);
  let date = moment().subtract(randInt(500), 'days');
  return {
    petit_truc_en_plus: uuid(),
    texte_libre: lorem.generateSentences(1),
    numero_gagnant: randInt(),
    taille_approximative: `${randInt(50000)}.${randInt(99)}`,
    solde_souhaite: Math.random() > 0.5 ? n : -Math.abs(n),
    jour_j: date.format('YYYY-MM-DDTHH:mm:ss') + (date.isDST() ? '+02:00': '+01:00'),
    hamlet: Math.random() >= 0.5,
    email: randomEmail({
      domain: 'np6.com'
    }),
    phone: `+336${randInt(89) + 10}${randInt(89) + 10}${randInt(89) + 10}${randInt(89) + 10}`,
    la_casa: `${randInt(83) + 10}${randInt(10) + 10}0`
  }
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

const run = async () => {
  const COUNT = 500000, INCREMENT = 10000;
  let path = 'C:\\Users\\mdihars\\Documents\\WORKSPACE\\FILES\\result.csv';
  console.log('path', path)
  await removeFile(path);
  let a = [];
  for (let i = 0; i < COUNT; i++) {
    let line = generateLine();
    // let line = Math.random() > 0.15 ? generateLine() : badLine();
    a.push(line);
    if (a.length === INCREMENT) {
      await appendFile(path, Papa.unparse(a, {
        delimiter: '|',
        header: (i === 0),
        // quotes: true,
        // quoteChar: '"',
        newline: '\r\n'
      }) + '\r\n')
      console.log('--> ', i + 1)
      a = [];
    }
  }
  await appendFile(path, Papa.unparse(a, {
    delimiter: '|',
    header: INCREMENT > COUNT,
    // quotes: true,
    // quoteChar: '"',
    newline: '\r\n'
  }) + '\r\n')
}

run();