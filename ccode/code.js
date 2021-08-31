var kP = {"/": [255, 0, 0], ".": [255, 127, 0], "-": [0, 83, 168]},
    rP = new RegExp("[^/. \n-]", "g"),
    zP = 2,
    iW, iH, cW, cH;


const box = document.getElementById("box"),
      canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      canvas2 = document.getElementById("canvas2"),
      ctx2 = canvas2.getContext("2d"),

      scan = document.getElementById("scan"),
      print = document.getElementById("print"),
      print2 = document.getElementById("print2"),
      kset = document.getElementById("kset"),
      zoom = document.getElementById("zoom"),
      split = document.getElementById("split"),
      crop = document.getElementById("crop"),
      size = document.getElementById("size");


box.value = "";
split.value = "";
kset.value = "{/:255,0,0}{.:255,127,0}{-:0,83,168}";
zoom.value = 2;


box.addEventListener("change", (e) => {

  const res = box.value.replace(rP, "");

  box.value = res;
  draw(res);

});


window.addEventListener("dragover", (e) => {

  e.preventDefault();

});


window.addEventListener("drop", (e) => {

  e.preventDefault();

  const file = e.dataTransfer.files[0];

  if (file) {
    loadfile(file);
  }

});


scan.addEventListener("change", (e) => {

  loadfile(e.target.files[0]);

});


print.addEventListener("click", () => {

  if (canvas.width === 0 || canvas.height === 0) {
    alert("Empty Canvas!");
    return;
  }

  var link = document.createElement("a");

  link.download = "download.png";
  link.href = canvas.toDataURL();

  link.click();
  link.delete;

});


print2.addEventListener("click", () => {

  if (box.value === "") {
    alert("Empty Field!");
    return;
  }

  var link = document.createElement("a");

  link.download = "download.txt";
  link.href = URL.createObjectURL(new Blob([box.value], {type: "text/plain"}));

  link.click();
  link.delete;

});


kset.addEventListener("change", () => {

  const res = kset.value.replace(/ /g, "").match(/{[^ ]:0*[0-9]*,0*[0-9]*,0*[0-9]*}/g);

  if (!res.length) {
    kset.value = Object.keys(kP).map(x => `{${x}:${kP[x].join(",")}}`).join("");
    return;
  }

  kP = res.reduce((obj, e) => {
    obj[e[1]] = new Uint8ClampedArray(e.slice(3, e.length - 1).split(","));
    return obj;
  }, {});
  rP = new RegExp(`[^ \n${Object.keys(kP).join("").replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}]`, "g");
  kset.value = Object.keys(kP).map(x => `{${x}:${kP[x].join(",")}}`).join("");

});


zoom.addEventListener("change", () => {

  if (zoom.value >= 1) {
    zP = zoom.value;
    if (canvas.width !== 0 && canvas.height !== 0) {
      display();
    }
  } else {
    zoom.value = zP;
  }

});


split.addEventListener("change", () => {

  const res = box.value.replace(/\n/g, "");

  iW = split.value;
  iH = Math.ceil(res.length / iW);

  if (iW < 1 || res === "") {
    split.value = "";
    return;
  }

  if (iW > 1024 || iH > 1024) {
    alert(`Canvas width/height exceeded!`);
    return;
  }

  if (res.length % iW) {
    box.value = res.replace(new RegExp(`.{${iW}}`, "g"), "$&\n");
  } else {
    box.value = res.replace(new RegExp(`.{${iW}}`, "g"), "$&\n").slice(0, -1);
  }


  var imgD = ctx.createImageData(iW, iH),
      data = imgD.data;

  for (var i = 0; i < res.length; i++) {

    const c = res.charAt(i);

    if (c !== " ") {

      const k = kP[c],
            t = i * 4;

      data[t + 0] = k[0];
      data[t + 1] = k[1];
      data[t + 2] = k[2];
      data[t + 3] = 255;

    }
  };

  canvas.width = iW;
  canvas.height = iH;
  ctx.putImageData(imgD, 0, 0);
  display();
  size.innerHTML = `W: ${iW}<br>H: ${iH}`;

});


crop.addEventListener("click", () => {

  const t0 = performance.now();

  iW = canvas.width;
  iH = canvas.height;

  if (iW === 0 || iH === 0) {
    return;
  }

  // https://gist.github.com/remy/784508
  // MIT license https://rem.mit-license.org
  var imgD = ctx.getImageData(0, 0, iW, iH),
      data = imgD.data,

      iL = null,
      iR = null,
      iT = null,
      iB = null,
      x, y;

  for (var i = 0; i < data.length; i += 4) {

    if (data[i + 3] !== 0) {

      x = (i / 4) % iW;
      y = Math.floor((i / 4) / iW);

      if (iT === null) {
        iT = y;
      }

      if (iL === null) {
        iL = x;
      } else if (x < iL) {
        iL = x;
      }

      if (iR === null) {
        iR = x;
      } else if (iR < x) {
        iR = x;
      }

      if (iB === null) {
        iB = y;
      } else if (iB < y) {
        iB = y;
      }

    }
  }

  if (iT === null) {
    canvas.width = 0;
    canvas.height = 0;
    canvas2.width = 300;
    canvas2.height = 150;

    box.value = "";
    size.innerHTML = "W: 0<br>H: 0";
    return;
  }

  iW = iR - iL + 1;
  iH = iB - iT + 1;

  imgD = ctx.getImageData(iL, iT, iW, iH);
  box.value = box.value.split("\n").slice(iT, iB + 1).map(e => e.slice(iL, iR + 1)).join("\n");

  canvas.width = iW;
  canvas.height = iH;
  ctx.putImageData(imgD, 0, 0);
  display();
  size.innerHTML = `W: ${iW}<br>H: ${iH}`;

  const t1 = performance.now();
  console.log(`Crop image: ${t1 - t0} ms`);

});


function display() {

  cW = canvas.width * zP;
  cH = canvas.height * zP;

  if (cW > 8192 || cH > 8192) {
    alert(`Viewport width/height exceeded!`);
    return;
  }

  canvas2.width = cW;
  canvas2.height = cH;
  ctx2.imageSmoothingEnabled = false;
  ctx2.drawImage(canvas, 0, 0, cW, cH);

}


function draw(e) {

  const t0 = performance.now();

  const str = e.split("\n");

  iW = Math.max(...(str.map(e => e.length)));
  iH = str.length;

  if (iW === 0) {
    canvas.width = 0;
    canvas.height = 0;
    canvas2.width = 300;
    canvas2.height = 150;

    box.value = "";
    size.innerHTML = "W: 0<br>H: 0";
    return;
  }

  if (iW > 1024 || iH > 1024) {
    alert(`Canvas width/height exceeded!`);
    canvas.width = 0;
    canvas.height = 0;
    canvas2.width = 300;
    canvas2.height = 150;

    size.innerHTML = "W: 0<br>H: 0";
    return;
  }

  var imgD = ctx.createImageData(iW, iH),
      data = imgD.data;

  str.forEach((e, index) => {

    for (var i = 0; i < e.length; i++) {

      const c = e.charAt(i);

      if (c !== " ") {

        const k = kP[c],
              t = (index * iW + i) * 4;

        data[t + 0] = k[0];
        data[t + 1] = k[1];
        data[t + 2] = k[2];
        data[t + 3] = 255;

      }
    }
  });

  canvas.width = iW;
  canvas.height = iH;
  ctx.putImageData(imgD, 0, 0);
  display();
  size.innerHTML = `W: ${iW}<br>H: ${iH}`;

  const t1 = performance.now();
  console.log(`Drawing canvas: ${t1 - t0} ms`);

}


function loadfile(file) {

  const read = new FileReader();
  console.log(`File name: ${file.name}\nFile size: ${file.size} bytes`);

  read.onload = () => {

    var img = new Image();

    img.onload = () => {

      const t0 = performance.now();

      iW = img.width;
      iH = img.height;

      if (iW > 1024 || iH > 1024) {
        alert(`Canvas width/height exceeded!`);
        return;
      }

      canvas.width = iW;
      canvas.height = iH;
      ctx.drawImage(img, 0, 0);

      const imgD = ctx.getImageData(0, 0, iW, iH),
            data = imgD.data;

      var s = new Array(iW * iH).fill(" ");

      for (var i = 0; i < data.length; i += 4) {
        data[i + 3] = 0;
      }

      Object.entries(kP).forEach((e) => {
        const [a, b] = e;
        for (var i = 0; i < data.length; i += 4) {
          if (data[i]     === b[0] &&
              data[i + 1] === b[1] &&
              data[i + 2] === b[2]) {
            s[i / 4] = a;
            data[i + 3] = 255;
          }
        }
      });

      box.value = s.join("").match(new RegExp(`.{${iW}}`, "g")).join("\n");
      ctx.putImageData(imgD, 0, 0);
      display();
      size.innerHTML = `W: ${iW}<br>H: ${iH}`;

      const t1 = performance.now();
      console.log(`Write to textarea: ${t1 - t0} ms`);
    }

    img.onerror = () => {

      const read2 = new FileReader();

      read2.onload = () => {

        const res = read2.result.replace(rP, "");

        box.value = res;
        draw(res);
      }

      read2.readAsText(file);
    }

    img.src = read.result;
  }

  read.readAsDataURL(file);
}
