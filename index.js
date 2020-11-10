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

const randDoctor = () => {
  const doctors = [
    "Christopher Eccleston (9)",
    "Colin Baker (6)",
    "David Tennant (10)",
    "Jodie Whittaker (13)",
    "Jon Pertwee (3)",
    "Math Smith (11)",
    "Patrick Throughton (2)",
    "Paul McGann",
    "Peter Capaldi (12)",
    "Peter Davison (5)",
    "Silvester McCoy (7)",
    "Tom Baker (4)",
    "William Hartnell (1)"
  ];

  return doctors[randInt(doctors.length)];
}

const tooLongString = () => {
  let str = [];
  for (let i = 0; i < 5; i++) {
    str.push(lorem.generateSentences(1));
  }
  return str.join (' ');
}


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
    line.la_casa = "3005181811001";
  }
  if (Math.random() > 0.5) {
    line.texte_libre = tooLongString();
  }
  if (Math.random() > 0.5) {
    line.le_docteur = "Rowan Artkinson";
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
    la_casa: `${randInt(83) + 10}${randInt(10) + 10}0`,
    le_docteur: randDoctor()
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
  const COUNT = 10000, INCREMENT = 1000;
  let path = 'C:\\Users\\mdihars\\Documents\\WORKSPACE\\FILES\\result.csv';
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
      console.log('--> ', i + 1)
      lines = [];
    }
  }
  if (lines.length) {
    await writeLines(path, lines);
  }
}

run();