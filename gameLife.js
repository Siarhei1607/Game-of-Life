 const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const widthInput = document.getElementById("widthInput");
    const heightInput = document.getElementById("heightInput");
    const count = document.getElementById('count');
    let width, height, sizeFieldWidth, sizeFieldHeight;
    const sizeCellwidth = 10;
    const sizeCellheight = 10;
    let mas = [];
    let timer;
    let maxWidth = 1300;
    let maxHeight = 1300;

    canvas.onclick = function(event) {
        let x = event.offsetX;
        let y = event.offsetY;
        x = Math.floor(x / sizeCellwidth);
        y = Math.floor(y / sizeCellheight);
        if(mas[y][x] !== 1){
            mas[y][x] = 1
        }else{mas[y][x] = 0
        }
        drawField();
    };

    function resizeCanvas() {
        width = Math.min(widthInput.value, maxWidth);
        height = Math.min(heightInput.value, maxHeight);
        let str = "";
        if(width === maxWidth) str += ` Установлена максимальная ширина поля игры ${maxWidth}`
        if(height === maxHeight) str += ` Установлена максимальная высота поля игры ${maxHeight}`
        if(str) alert(str);
        width = Math.trunc(width/sizeCellwidth) * sizeCellwidth;
        height = Math.trunc(height/sizeCellheight) * sizeCellheight;
        canvas.width = widthInput.value = width;
        canvas.height = heightInput.value = height;
        sizeFieldWidth = width / sizeCellwidth;
        sizeFieldHeight = height / sizeCellheight;
        goLife();
    }

    function goLife() {
        for (let i = 0; i < sizeFieldHeight; i++) {
            mas[i] = [];
            for (let j = 0; j < sizeFieldWidth; j++) {
                mas[i][j] = 0;
            }
        }
    }
    resizeCanvas();

    function drawField() {

        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < sizeFieldHeight; i++) {
            for (let j = 0; j < sizeFieldWidth; j++) {

                if (mas[i][j] === 1) {
                    ctx.fillRect(j * sizeCellwidth, i * sizeCellheight, sizeCellwidth, sizeCellheight);
                }
            }
        }
    }

    function startLife() {
        pauseLife();
        let mas2 = [];
        for (let i = 0; i < sizeFieldHeight; i++) {
            mas2[i] = [];
            for (let j = 0; j < sizeFieldWidth; j++) {
                let neighbors = [-1, 1].reduce((a, b) => {
                    b = mas[i + b];
                    if (b === undefined)
                        return a;
                    let num = b[j];
                    if (b[j + 1] !== undefined) {
                        num += b[j + 1]
                    }
                    if (b[j - 1] !== undefined) {
                        num += b[j - 1]
                    }
                    return a + num;
                }, 0);
                neighbors = [-1, 1].reduce((a, b) => a += mas[i][j + b] !== undefined && mas[i][j + b], neighbors);
                mas2[i][j] = +(neighbors === 3 || (mas[i][j] && neighbors === 2));
            }
        }
        mas = mas2;
        drawField();
        count.innerHTML++;
        const delay = document.querySelector("[name='speed']:checked").value;
        timer = setTimeout(startLife, delay);
    }

    function pauseLife() {
        clearInterval(timer)
    }

    function stopLife() {
        pauseLife();
        goLife();
        drawField();
        count.innerHTML = 0;
    }
    document.getElementById("create").onclick = resizeCanvas;
    document.getElementById("start").onclick = startLife;
    document.getElementById("pause").onclick = pauseLife;
    document.getElementById("stop").onclick = stopLife;
