const charList = [

  "\u0000", "\u0001", "\u0002", "\u0003", "\u0004", "\u0005", "\u0006", "\u0007",
      "\b",     "\t",     "\n", "\u000b",     "\f",     "\r", "\u000e", "\u000f",
  "\u0010", "\u0011", "\u0012", "\u0013", "\u0014", "\u0015", "\u0016", "\u0017",
  "\u0018", "\u0019", "\u001a", "\u001b", "\u001c", "\u001d", "\u001e", "\u001f",
       " ",      "!",     "\"",      "#",      "$",      "%",      "&",      "'",
       "(",      ")",      "*",      "+",      ",",      "-",      ".",      "/",
       "0",      "1",      "2",      "3",      "4",      "5",      "6",      "7",
       "8",      "9",      ":",      ";",      "<",      "=",      ">",      "?",
       "@",      "A",      "B",      "C",      "D",      "E",      "F",      "G",
       "H",      "I",      "J",      "K",      "L",      "M",      "N",      "O",
       "P",      "Q",      "R",      "S",      "T",      "U",      "V",      "W",
       "X",      "Y",      "Z",      "[",     "\\",      "]",      "^",      "_",
       "`",      "a",      "b",      "c",      "d",      "e",      "f",      "g",
       "h",      "i",      "j",      "k",      "l",      "m",      "n",      "o",
       "p",      "q",      "r",      "s",      "t",      "u",      "v",      "w",
       "x",      "y",      "z",      "{",      "|",      "}",     null,      "~",
       "€",     null,      "‚",      "ƒ",      "„",      "…",      "†",      "‡",
       "ˆ",      "‰",      "Š",      "‹",      "Œ",     null,      "Ž",     null,
      null,      "‘",      "’",      "“",      "”",      "•",      "–",      "—",
       "˜",      "™",      "š",      "›",      "œ",     null,      "ž",      "Ÿ",
       " ",      "¡",      "¢",      "£",      "¤",      "¥",      "¦",      "§",
       "¨",      "©",      "ª",      "«",      "¬",      "­",      "®",      "¯",
       "°",      "±",      "²",      "³",      "´",      "µ",      "¶",      "·",
       "¸",      "¹",      "º",      "»",      "¼",      "½",      "¾",      "¿",
       "À",      "Á",      "Â",      "Ã",      "Ä",      "Å",      "Æ",      "Ç",
       "È",      "É",      "Ê",      "Ë",      "Ì",      "Í",      "Î",      "Ï",
       "Ð",      "Ñ",      "Ò",      "Ó",      "Ô",      "Õ",      "Ö",      "×",
       "Ø",      "Ù",      "Ú",      "Û",      "Ü",      "Ý",      "Þ",      "ß",
       "à",      "á",      "â",      "ã",      "ä",      "å",      "æ",      "ç",
       "è",      "é",      "ê",      "ë",      "ì",      "í",      "î",      "ï",
       "ð",      "ñ",      "ò",      "ó",      "ô",      "õ",      "ö",      "÷",
       "ø",      "ù",      "ú",      "û",      "ü",      "ý",      "þ",      "ÿ"

];


const box = document.getElementById("box"),
      imp = document.getElementById("imp"),
      exp = document.getElementById("exp"),
      fileop = document.getElementById("fileop"),
      conv = document.getElementById("conv"),
      coop = document.getElementById("coop"),
      coop2 = document.getElementById("coop2"),
      filename = document.getElementById("filename");


box.value = "";
filename.value = "file.dat";


window.addEventListener("dragover", (e) => {

  e.preventDefault();

});


window.addEventListener("drop", (e) => {

  e.preventDefault();

  const file = e.dataTransfer.files[0];

  if (file) {
    load(file);
  }

});


imp.addEventListener("change", (e) => {

  load(e.target.files[0]);

});


exp.addEventListener("click", () => {

  var res = fileop.value === "0" ? fromHex(box.value) : fromBin(box.value);

  if (res !== null) {
    box.value = res[0];
    save(res[1]);
  }

});


conv.addEventListener("click", () => {

  var res,
      j = coop.value,
      k = coop2.value;

  switch (j) {
    case "0":
      res = fromTxt(box.value);
      break;
    case "1":
      res = fromHex(box.value);
      break;
    case "2":
      res = fromBin(box.value);
  }

  if (res !== null) {
    if (j === k) {
      box.value = res[0];
    } else {
      switch (k) {
        case "1":
          toHex(res[1]);
          break;
        case "2":
          toBin(res[1]);
      }
    }
  }

});


function load(e) {

  var read = new FileReader();
  console.log(`File name: ${e.name}\nFile size: ${e.size} bytes`);
  filename.value = e.name;

  read.onload = function () {

    var bytes = Array.from(new Uint8Array(read.result));

    if (fileop.value === "0") {
      toHex(bytes);
    } else {
      toBin(bytes);
    }

  }

  read.readAsArrayBuffer(e);

}


function save(e) {

  var link = document.createElement("a");

  link.download = filename.value;
  link.href = URL.createObjectURL(new Blob([new Uint8Array(e)], {type: "application/octet-stream"}));

  link.click();
  link.delete;

}


function fromTxt(e) {

  return [null, e.split("").map(x => x.charCodeAt(0) > 255 ? charList.indexOf(x) : x.charCodeAt(0))];

}


function fromHex(e) {

  var cleaned = e.replace(/[^A-Fa-f0-9]/g, "");

  if (cleaned === "") {
    return null; 
  }

  if (cleaned.length % 2) {
    if (window.confirm("String length is odd.\nContinue?")) {
      cleaned += "0";
    } else {
      return null;
    }
  }

  cleaned = cleaned.match(/.{2}/g);
  return [cleaned.join(" "), cleaned.map(x => parseInt(x, 16))];

}


function fromBin(e) {

  var cleaned = e.replace(/[^01]/g, "");

  if (cleaned === "") {
    return null;
  }

  if (cleaned.length % 8) {
    if (window.confirm("String length is odd.\nContinue?")) {
      cleaned += "00000000".slice(cleaned.length % 8);
    } else {
      return null;
    }
  }

  return [cleaned, cleaned.match(/.{8}/g).map(x => parseInt(x, 2))];

}


function toHex(e) {

  box.value = e.map(x => x < 0 ? "??" : x.toString(16).padStart(2, "0")).join(" ");

}


function toBin(e) {

  box.value = e.map(x => x < 0 ? "????????" : x.toString(2).padStart(8, 0)).join("");

}