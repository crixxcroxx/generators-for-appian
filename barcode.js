document.getElementById("submit").addEventListener("click", (e) => {
  e.preventDefault();
  const userInput = document.getElementById("code").value;
  userInput.slice(0, 9);
  const imgTags = document.getElementsByTagName("img");

  /* remove all generated barcode images first */
  for (const key in imgTags) {
    if (Object.hasOwnProperty.call(imgTags, key)) {
      const element = imgTags[key];
      element.remove();
    }
  }

  /* call to barcode generator */
  if (userInput !== "") {
    JsBarcode("#barcode", userInput, {
      format: "code128" /* type of barcode - see docs for supported types */,
      lineColor: "black",
      width: 4,
      height: 80,
    });
  }

  /* convert generated svg to png */
  const svg = `${document.getElementsByClassName("barcode")[0].outerHTML}`;

  const element = document.getElementById("barcode");
  element.style.display = "none";

  svgToPng(String(svg), (imgData) => {
    const pngImage = document.createElement("img");
    const element = document.querySelector(".card-content");
    element.appendChild(pngImage);
    pngImage.src = imgData;
  });

  function svgToPng(svg, callback) {
    const url = getSvgUrl(svg);
    svgUrlToPng(url, (imgData) => {
      callback(imgData);
      URL.revokeObjectURL(url);
    });
  }

  function getSvgUrl(svg) {
    return URL.createObjectURL(
      new Blob([svg], {
        type: "image/svg+xml",
      })
    );
  }

  function svgUrlToPng(svgUrl, callback) {
    const svgImage = document.createElement("img");
    document.body.appendChild(svgImage);
    svgImage.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = svgImage.clientWidth;
      canvas.height = svgImage.clientHeight;
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.drawImage(svgImage, 0, 0);
      const imgData = canvas.toDataURL("image/png");
      callback(imgData);
      document.body.removeChild(svgImage);
    };
    svgImage.src = svgUrl;
  }
});
