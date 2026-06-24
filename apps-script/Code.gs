/**
 * Top 10 interactif — Mondial 2026
 * Backend Google Apps Script : collecte les votes (classements) et renvoie le décompte.
 *
 * Déploiement :
 *  1. Crée un Google Sheet (vierge).
 *  2. Menu  Extensions ▸ Apps Script.
 *  3. Colle ce code dans Code.gs (remplace tout) et enregistre.
 *  4. Déployer ▸ Nouveau déploiement ▸ type « Application Web ».
 *       - Exécuter en tant que : Moi
 *       - Qui a accès : Tout le monde
 *  5. Copie l'URL qui finit par /exec et colle-la dans index.html / en.html / pt.html :
 *       CONFIG.votesUrl = "https://script.google.com/macros/s/XXXX/exec";
 *
 * La feuille « Votes » est créée automatiquement au premier vote.
 * Chaque joueur classé d'un vote = 1 ligne : [timestamp, session, rang, idJoueur, nomJoueur, langue].
 */

var SHEET_NAME = 'Votes';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(8000);
    var body = JSON.parse(e.postData.contents);
    var session = String(body.session || '').slice(0, 60);
    var lang = String(body.lang || '').slice(0, 8);
    var ranking = Array.isArray(body.ranking) ? body.ranking : [];

    var sh = getSheet_();
    var now = new Date();
    var rows = [];
    ranking.forEach(function (r) {
      var rank = parseInt(r.rank, 10);
      var id = String(r.id || '');
      if (id && rank >= 1 && rank <= 10) {
        rows.push([now, session, rank, id, String(r.name || ''), lang]);
      }
    });
    if (rows.length) {
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
    }
    return json_({ ok: true, stored: rows.length });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function doGet() {
  try {
    var sh = getSheet_();
    var last = sh.getLastRow();
    var tally = {};      // { idJoueur: { rang: nbVotes } }
    var sessions = {};   // pour compter le nombre de votants distincts

    if (last > 1) {
      var values = sh.getRange(2, 1, last - 1, 6).getValues();
      values.forEach(function (row) {
        var session = row[1];
        var rank = parseInt(row[2], 10);
        var id = String(row[3]);
        if (!id || !(rank >= 1 && rank <= 10)) return;
        sessions[session] = true;
        if (!tally[id]) tally[id] = {};
        tally[id][rank] = (tally[id][rank] || 0) + 1;
      });
    }
    return json_({ ok: true, votes: Object.keys(sessions).length, tally: tally });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['timestamp', 'session', 'rank', 'playerId', 'playerName', 'lang']);
  }
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
