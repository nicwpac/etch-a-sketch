let maxRowCount = 20;
let maxColumnCount = 20;
let mouseIsDown = false;

let gridSquares = [];

const grid = document.querySelector("#grid");

const rowInput = document.querySelector("#input-grid-row");
rowInput.addEventListener("change", () => {
    onDimensionChange();
});
const columnInput = document.querySelector("#input-grid-column");
columnInput.addEventListener("change", () => {
    onDimensionChange();
});

const createGridBtn = document.querySelector("#create-grid-btn");
createGridBtn.addEventListener("click", () => createGrid(maxRowCount, maxColumnCount));

window.addEventListener("mousedown", () => mouseIsDown = true);
window.addEventListener("mouseup", () => mouseIsDown = false);
window.addEventListener("dragStart", (event) => event.preventDefault());

function createGrid() {
    grid.replaceChildren();
    maxRowCount = clampDimension(rowInput);
    maxColumnCount = clampDimension(columnInput);
    onDimensionChange();

    let newGridSquares = [];

    for (let i = 0; i < maxRowCount; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        grid.append(row);
        for (let j = 0; j < maxColumnCount; j++) {
            const gridSquare = document.createElement("div");
            gridSquare.classList.add("grid-square");

            newGridSquares.push([gridSquare, i, j])

            const gs = getComputedStyle(grid);
            let paddingOffsetWidth = parseFloat(gs.paddingLeft) + parseFloat(gs.paddingRight);
            let paddingOffsetHeight = parseFloat(gs.paddingTop) + parseFloat(gs.paddingBottom);
            let length = Math.min((grid.clientWidth - paddingOffsetWidth) / maxColumnCount, 
                (grid.clientHeight - paddingOffsetHeight) / maxRowCount);
            
            gridSquare.style.width = length + "px";
            gridSquare.style.height = length + "px";
            
            gridSquare.addEventListener("mouseenter", () => {
                if (mouseIsDown) {
                    const match = gridSquares.find(([square, row, column]) => row == i && column == j);
                    const oldSquare = match ? match[0] : null; 
                    
                    if (oldSquare) {
                        const oldColour = (getComputedStyle(oldSquare).backgroundColor).replace(/[^\d,.]/g, '').split(',');
                        gridSquare.style.backgroundColor = gridSquareOnHover(oldColour[3]);
                    }
                    else
                        gridSquare.style.backgroundColor = gridSquareOnHover(0);
                }
            });

            gridSquare.addEventListener("mouseexit", () => {
                if (!keepSquaresColoured)
                    gridSquare.style.backgroundColor = "rgba(255, 255, 255, 0)";
            });

            gridSquare.style.backgroundColor = "rgba(255, 255, 255, 0)";
            
            row.append(gridSquare);
        }
    }

    gridSquares.length = 0;
    gridSquares = newGridSquares;
}

function onDimensionChange() {
    if (rowInput.value == maxRowCount && columnInput.value == maxColumnCount)
        createGridBtn.textContent = "Reset";
    else
        createGridBtn.textContent = "Create New Grid";

    console.log(`rowInput.value = ${rowInput.value}, maxRowCount = ${maxRowCount}\ncolumnInput.value = ${columnInput.value}, maxColumnInput = ${maxColumnCount}`)
}

function gridSquareOnHover(oldAlpha) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = parseFloat(oldAlpha) + .1; 
    
    const result = `rgba(${r}, ${g}, ${b}, ${a})`;
    return result;
}

function clampDimension(inputElement) {
    inputElement.value = Math.min(inputElement.value, 99);
    inputElement.value = Math.max(inputElement.value, 1)
    return inputElement.value;
}

createGrid(maxRowCount, maxColumnCount);
