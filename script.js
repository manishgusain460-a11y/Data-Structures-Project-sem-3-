// --- NAVIGATION LOGIC ---
const navTabs = { sorting: document.getElementById('btn-nav-sorting'), pathfinding: document.getElementById('btn-nav-pathfinding') };
const sections = { sorting: document.getElementById('section-sorting'), pathfinding: document.getElementById('section-pathfinding') };

navTabs.sorting.addEventListener('click', () => switchTab('sorting'));
navTabs.pathfinding.addEventListener('click', () => switchTab('pathfinding'));

function switchTab(tab) {
    Object.values(navTabs).forEach(btn => btn.classList.remove('active'));
    Object.values(sections).forEach(sec => sec.classList.remove('active'));
    navTabs[tab].classList.add('active');
    sections[tab].classList.add('active');
    if (tab === 'pathfinding' && !gridInitialized) initializeGrid();
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let isAlgorithmRunning = false;

// ==========================================
// 1. SORTING ALGORITHMS LOGIC
// ==========================================
let array = [];
let sortStats = { unsorted: 0, sorted: 0, comparisons: 0, swaps: 0 };
const sortingContainer = document.getElementById('sorting-container');
const sizeSlider = document.getElementById('array-size');
const algoSelect = document.getElementById('sort-algo');

const complexities = {
    bubble: { best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
    selection: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)" },
    insertion: { best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
    merge: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
    quick: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)" }
};

algoSelect.addEventListener('change', () => {
    document.getElementById('comp-best').innerText = complexities[algoSelect.value].best;
    document.getElementById('comp-avg').innerText = complexities[algoSelect.value].avg;
    document.getElementById('comp-worst').innerText = complexities[algoSelect.value].worst;
});

function updateStatsUI() {
    document.getElementById('stat-unsorted').innerText = sortStats.unsorted;
    document.getElementById('stat-sorted').innerText = sortStats.sorted;
    document.getElementById('stat-comparisons').innerText = sortStats.comparisons;
    document.getElementById('stat-swaps').innerText = sortStats.swaps;
}

function generateArray() {
    if (isAlgorithmRunning) return;
    array = [];
    sortingContainer.innerHTML = '';
    const size = parseInt(sizeSlider.value);
    document.getElementById('size-val').innerText = size;
    sortStats = { unsorted: size, sorted: 0, comparisons: 0, swaps: 0 };
    updateStatsUI();
    
    const bookWidth = Math.max(2, Math.floor(800 / size) - 3);

    for (let i = 0; i < size; i++) {
        let val = Math.floor(Math.random() * 90) + 10;
        array.push(val);
        const book = document.createElement('div');
        book.classList.add('book');
        book.style.height = `${val}%`;
        book.style.width = `${bookWidth}px`;
        sortingContainer.appendChild(book);
    }
}

function getSortSpeed() {
    const speeds = [300, 150, 50, 15, 2];
    const val = document.getElementById('sort-speed').value;
    document.getElementById('speed-val').innerText = val;
    return speeds[parseInt(val) - 1];
}

sizeSlider.addEventListener('input', generateArray);
document.getElementById('sort-speed').addEventListener('input', getSortSpeed);
document.getElementById('btn-generate').addEventListener('click', generateArray);

async function swapBooks(el1, el2) {
    const tempHeight = el1.style.height;
    el1.style.height = el2.style.height;
    el2.style.height = tempHeight;
    sortStats.swaps++;
    updateStatsUI();
}

function setBookColor(book, type) {
    if(type === 'compare') book.style.background = 'var(--book-compare)';
    else if(type === 'sorted') book.style.background = 'var(--book-sorted)';
    else book.style.background = 'linear-gradient(180deg, var(--book-default) 0%, #4f46e5 100%)';
}

function markSorted() {
    sortStats.sorted++;
    sortStats.unsorted--;
    updateStatsUI();
}

document.getElementById('btn-sort').addEventListener('click', async () => {
    if (isAlgorithmRunning) return;
    isAlgorithmRunning = true;
    document.getElementById('btn-generate').disabled = true;
    document.getElementById('btn-sort').disabled = true;
    sizeSlider.disabled = true;
    
    const algo = algoSelect.value;
    if (algo === 'bubble') await bubbleSort();
    else if (algo === 'selection') await selectionSort();
    else if (algo === 'insertion') await insertionSort();
    else if (algo === 'merge') await mergeSortWrapper();
    else if (algo === 'quick') await quickSortWrapper();

    let books = document.querySelectorAll('.book');
    for(let b of books) setBookColor(b, 'sorted');
    sortStats.sorted = array.length; sortStats.unsorted = 0; updateStatsUI();
    
    isAlgorithmRunning = false;
    document.getElementById('btn-generate').disabled = false;
    document.getElementById('btn-sort').disabled = false;
    sizeSlider.disabled = false;
});

// Algos
async function bubbleSort() {
    let books = document.querySelectorAll('.book');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            sortStats.comparisons++; updateStatsUI();
            setBookColor(books[j], 'compare'); setBookColor(books[j+1], 'compare');
            await sleep(getSortSpeed());
            if (array[j] > array[j+1]) {
                [array[j], array[j+1]] = [array[j+1], array[j]];
                await swapBooks(books[j], books[j+1]);
            }
            setBookColor(books[j], 'default'); setBookColor(books[j+1], 'default');
        }
        setBookColor(books[array.length - i - 1], 'sorted');
        markSorted();
    }
    markSorted(); // last element
}

async function selectionSort() {
    let books = document.querySelectorAll('.book');
    for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        setBookColor(books[i], 'compare');
        for (let j = i + 1; j < array.length; j++) {
            sortStats.comparisons++; updateStatsUI();
            setBookColor(books[j], 'compare');
            await sleep(getSortSpeed());
            if (array[j] < array[minIdx]) {
                if(minIdx !== i) setBookColor(books[minIdx], 'default');
                minIdx = j;
            } else {
                setBookColor(books[j], 'default');
            }
        }
        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            await swapBooks(books[i], books[minIdx]);
        }
        setBookColor(books[minIdx], 'default');
        setBookColor(books[i], 'sorted');
        markSorted();
    }
    markSorted();
}

async function insertionSort() {
    let books = document.querySelectorAll('.book');
    setBookColor(books[0], 'sorted'); markSorted();
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        setBookColor(books[i], 'compare');
        await sleep(getSortSpeed());
        
        while (j >= 0 && array[j] > key) {
            sortStats.comparisons++; sortStats.swaps++; updateStatsUI();
            setBookColor(books[j], 'compare');
            array[j + 1] = array[j];
            books[j + 1].style.height = books[j].style.height;
            await sleep(getSortSpeed());
            setBookColor(books[j], 'sorted');
            j = j - 1;
        }
        sortStats.comparisons++; // failed loop check
        array[j + 1] = key;
        books[j + 1].style.height = `${key}%`;
        setBookColor(books[i], 'sorted');
        markSorted();
    }
}

async function mergeSortWrapper() { await mergeSort(0, array.length - 1); }
async function mergeSort(l, r) {
    if (l >= r) return;
    let m = l + Math.floor((r - l) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}
async function merge(l, m, r) {
    let books = document.querySelectorAll('.book');
    let n1 = m - l + 1, n2 = r - m;
    let L = new Array(n1), R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = array[l + i];
    for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];
    
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        sortStats.comparisons++; updateStatsUI();
        setBookColor(books[k], 'compare');
        await sleep(getSortSpeed());
        if (L[i] <= R[j]) { array[k] = L[i]; books[k].style.height = `${L[i]}%`; i++; }
        else { array[k] = R[j]; books[k].style.height = `${R[j]}%`; j++; }
        setBookColor(books[k], 'default');
        k++; sortStats.swaps++; updateStatsUI();
    }
    while (i < n1) { array[k] = L[i]; books[k].style.height = `${L[i]}%`; i++; k++; sortStats.swaps++; updateStatsUI(); }
    while (j < n2) { array[k] = R[j]; books[k].style.height = `${R[j]}%`; j++; k++; sortStats.swaps++; updateStatsUI(); }
}

async function quickSortWrapper() { await quickSort(0, array.length - 1); }
async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}
async function partition(low, high) {
    let books = document.querySelectorAll('.book');
    let pivot = array[high];
    setBookColor(books[high], 'sorted'); // highlight pivot
    let i = (low - 1);
    for (let j = low; j <= high - 1; j++) {
        sortStats.comparisons++; updateStatsUI();
        setBookColor(books[j], 'compare');
        await sleep(getSortSpeed());
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            await swapBooks(books[i], books[j]);
        }
        setBookColor(books[j], 'default');
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    await swapBooks(books[i + 1], books[high]);
    setBookColor(books[high], 'default');
    return (i + 1);
}

generateArray();
algoSelect.dispatchEvent(new Event('change'));

// ==========================================
// 2. PATHFINDING ALGORITHMS LOGIC
// ==========================================
const ROWS = 21, COLS = 45;
let grid = [];
let START_NODE = {r: 10, c: 8};
let END_NODE = {r: 10, c: 36};
let gridInitialized = false;

// Drag state: 'none', 'start', 'end', 'wall'
let dragState = 'none'; 

const gridContainer = document.getElementById('grid-container');
gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 26px)`;

function initializeGrid() {
    gridContainer.innerHTML = '';
    grid = [];
    for (let r = 0; r < ROWS; r++) {
        let currentRow = [];
        for (let c = 0; c < COLS; c++) {
            const isStart = r === START_NODE.r && c === START_NODE.c;
            const isEnd = r === END_NODE.r && c === END_NODE.c;
            currentRow.push({ r, c, isWall: false, isVisited: false, prev: null });
            
            const nodeEl = document.createElement('div');
            nodeEl.id = `node-${r}-${c}`;
            nodeEl.className = 'node';
            if (isStart) nodeEl.classList.add('node-start');
            if (isEnd) nodeEl.classList.add('node-end');
            
            nodeEl.addEventListener('mousedown', (e) => handleMouseDown(e, r, c));
            nodeEl.addEventListener('mouseenter', (e) => handleMouseEnter(e, r, c));
            nodeEl.addEventListener('mouseup', () => dragState = 'none');
            
            gridContainer.appendChild(nodeEl);
        }
        grid.push(currentRow);
    }
    gridInitialized = true;
    gridContainer.addEventListener('mouseleave', () => dragState = 'none');
}

function handleMouseDown(e, r, c) {
    if (isAlgorithmRunning) return;
    e.preventDefault();
    if (r === START_NODE.r && c === START_NODE.c) dragState = 'start';
    else if (r === END_NODE.r && c === END_NODE.c) dragState = 'end';
    else {
        dragState = 'wall';
        toggleWall(r, c);
    }
}

function handleMouseEnter(e, r, c) {
    if (isAlgorithmRunning || dragState === 'none') return;
    e.preventDefault();
    
    if (dragState === 'start') {
        if (r === END_NODE.r && c === END_NODE.c) return;
        document.getElementById(`node-${START_NODE.r}-${START_NODE.c}`).classList.remove('node-start');
        START_NODE = {r, c};
        document.getElementById(`node-${r}-${c}`).classList.add('node-start');
        grid[r][c].isWall = false; // clear wall if dragging over
        document.getElementById(`node-${r}-${c}`).classList.remove('node-wall');
    } 
    else if (dragState === 'end') {
        if (r === START_NODE.r && c === START_NODE.c) return;
        document.getElementById(`node-${END_NODE.r}-${END_NODE.c}`).classList.remove('node-end');
        END_NODE = {r, c};
        document.getElementById(`node-${r}-${c}`).classList.add('node-end');
        grid[r][c].isWall = false;
        document.getElementById(`node-${r}-${c}`).classList.remove('node-wall');
    } 
    else if (dragState === 'wall') {
        toggleWall(r, c);
    }
}

function toggleWall(r, c) {
    if ((r === START_NODE.r && c === START_NODE.c) || (r === END_NODE.r && c === END_NODE.c)) return;
    const node = grid[r][c];
    node.isWall = !node.isWall;
    document.getElementById(`node-${r}-${c}`).classList.toggle('node-wall');
}

document.getElementById('btn-clear-board').addEventListener('click', () => {
    if(isAlgorithmRunning) return;
    initializeGrid();
    document.getElementById('nodes-explored').innerText = '0';
    document.getElementById('path-length').innerText = '0';
});

document.getElementById('btn-clear-path').addEventListener('click', clearPath);

function clearPath() {
    if(isAlgorithmRunning) return;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            grid[r][c].isVisited = false;
            grid[r][c].prev = null;
            const el = document.getElementById(`node-${r}-${c}`);
            el.classList.remove('node-visited', 'node-path');
        }
    }
    document.getElementById('nodes-explored').innerText = '0';
    document.getElementById('path-length').innerText = '0';
}

function getPathSpeed() {
    const speeds = [100, 50, 20, 5, 0];
    return speeds[parseInt(document.getElementById('path-speed').value) - 1];
}

document.getElementById('btn-start-path').addEventListener('click', async () => {
    if (isAlgorithmRunning) return;
    isAlgorithmRunning = true;
    clearPath();
    
    const algo = document.getElementById('path-algo').value;
    if (algo === 'bfs') await bfs();
    else if (algo === 'dfs') await dfs();
    
    isAlgorithmRunning = false;
});

async function bfs() {
    let queue = [grid[START_NODE.r][START_NODE.c]];
    grid[START_NODE.r][START_NODE.c].isVisited = true;
    let exploredCount = 0;
    const delay = getPathSpeed();

    while (queue.length > 0) {
        let curr = queue.shift();
        
        if (curr.r === END_NODE.r && curr.c === END_NODE.c) { await drawPath(curr); return; }

        if (!(curr.r === START_NODE.r && curr.c === START_NODE.c)) {
            document.getElementById(`node-${curr.r}-${curr.c}`).classList.add('node-visited');
            exploredCount++; document.getElementById('nodes-explored').innerText = exploredCount;
            if(delay > 0) await sleep(delay);
        }

        for (let neighbor of getNeighbors(curr)) {
            if (!neighbor.isVisited && !neighbor.isWall) {
                neighbor.isVisited = true;
                neighbor.prev = curr;
                queue.push(neighbor);
            }
        }
    }
}

async function dfs() {
    let stack = [grid[START_NODE.r][START_NODE.c]];
    let exploredCount = 0;
    const delay = getPathSpeed();

    while (stack.length > 0) {
        let curr = stack.pop();

        if(curr.isVisited) continue;
        curr.isVisited = true;

        if (curr.r === END_NODE.r && curr.c === END_NODE.c) { await drawPath(curr); return; }

        if (!(curr.r === START_NODE.r && curr.c === START_NODE.c)) {
            document.getElementById(`node-${curr.r}-${curr.c}`).classList.add('node-visited');
            exploredCount++; document.getElementById('nodes-explored').innerText = exploredCount;
            if(delay > 0) await sleep(delay);
        }

        let neighbors = getNeighbors(curr).reverse(); 
        for (let neighbor of neighbors) {
            if (!neighbor.isVisited && !neighbor.isWall) {
                neighbor.prev = curr;
                stack.push(neighbor);
            }
        }
    }
}

function getNeighbors(node) {
    let neighbors = [];
    const {r, c} = node;
    if (r > 0) neighbors.push(grid[r - 1][c]); // Up
    if (c < COLS - 1) neighbors.push(grid[r][c + 1]); // Right
    if (r < ROWS - 1) neighbors.push(grid[r + 1][c]); // Down
    if (c > 0) neighbors.push(grid[r][c - 1]); // Left
    return neighbors;
}

async function drawPath(endNode) {
    let path = [];
    let curr = endNode;
    while (curr !== null) {
        path.unshift(curr);
        curr = curr.prev;
    }
    
    document.getElementById('path-length').innerText = path.length - 1;

    for (let i = 1; i < path.length - 1; i++) {
        const node = path[i];
        document.getElementById(`node-${node.r}-${node.c}`).classList.add('node-path');
        await sleep(20);
    }
}