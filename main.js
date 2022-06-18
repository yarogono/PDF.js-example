let noticeBtnAll = document.querySelectorAll(".notice__btn");

const SAMPLE_ONE_CANVAS = document.getElementById("jsSampleOneCanvas");
const SAMPLE_TWO_CANVAS = document.getElementById("jsSampleTwoCanvas");
const SAMPLE_THREE_CANVAS = document.getElementById("jsSampleThreeCanvas")
const SAMPLE_FOUR_CANVAS = document.getElementById("jsSampleFourCanvas")

const CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/cmaps/';

const CANVAS_ARRAY = [SAMPLE_ONE_CANVAS,
                      SAMPLE_TWO_CANVAS,
                      SAMPLE_THREE_CANVAS,
                      SAMPLE_FOUR_CANVAS];

// PDF.JS (pdf to image convertor)
let pdfJsLib = window['pdfjs-dist/build/pdf'];

pdfJsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

function imgOpenClose(event) {
    let btn = event.target;
    let btnDiv = btn.parentNode;
    let canvas = btnDiv.parentNode.querySelector(".notice__canvas");

    if(!canvas.style.display || canvas.style.display === "none") {
        canvas.style.display = "block";
        btn.innerHTML = "expand_less";
        btnDiv.style.borderBottom = "1px solid rgba(128, 128, 128, 0.3)";
    } else {
        canvas.style.display = "none";
        btn.innerHTML = "expand_more";
        btnDiv.style.borderBottom = "none";
    }
}

function pdfToImg(urlArr) {

    let pdfUrl = ["pdf/1-1.pdf",
                      "pdf/1-2.pdf",
                      "pdf/1-3.pdf",
                      "pdf/1-4.pdf"];

    for (let i = 0; i < pdfUrl.length; i++) {
        pdfRender(pdfUrl[i], CANVAS_ARRAY[i]);
    }
}

function pdfRender(url, canvas) {
    let loadingTask = pdfJsLib.getDocument({
        cMapPacked: true,
        disableFontFace: true,
        cMapUrl: CMAP_URL,
        url: url
    });

    loadingTask.promise.then(function (pdf) {
        // Fetch the first page
        let pageNumber = 1;
        pdf.getPage(pageNumber).then(function (page) {

            let scale = 1.5;
            let viewport = page.getViewport({scale: scale});

            // Prepare canvas using PDF page dimensions
            let context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            let renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            let renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
            });
        });
    }, function (reason) {
        console.error(reason);
    });
}

function init() {
    for(const btn of noticeBtnAll) {
        btn.childNodes[1].addEventListener("click", imgOpenClose);
    }
    pdfToImg();
}

init();
