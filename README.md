# AlgoLab — Interactive DSA Visualizer

AlgoLab is a browser-based learning playground that helps learners understand sorting and pathfinding algorithms through animated, interactive visualizations.

## Features

### Sorting Lab
- Visualize Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort.
- Generate a random array and adjust its size.
- Control the animation speed.
- Track comparisons, moves, sorted items, and unsorted items in real time.
- View best, average, and worst-case time complexity for the selected algorithm.

### Pathfinding Lab
- Visualize Breadth-First Search (BFS) and Depth-First Search (DFS).
- Move the start and target markers by dragging them.
- Draw walls by clicking or dragging over grid cells.
- Adjust animation speed.
- Track explored nodes and path length.
- Clear the search trace or reset the grid.

## Built With

- HTML5
- CSS3
- Vanilla JavaScript

No framework, package installation, or build step is required.

## Run Locally

1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a web browser.

You can also use the Live Server extension in Visual Studio Code for local development.

## Project Structure

```text
algolab-dsa-visualizer/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Use

1. Choose **Sorting lab** or **Pathfinding lab** from the navigation.
2. In Sorting Lab, select an algorithm, set the array size and speed, then click **Start sorting**. Use **Shuffle values** to generate a new array.
3. In Pathfinding Lab, choose BFS or DFS. Drag the start/target markers and draw walls as needed, then click **Run search**.
4. Use the clear controls to remove the search trace or reset the grid.

## Notes

- The project runs entirely in the browser.
- An internet connection may be needed to load the Google Fonts used in the interface; the visualizer itself does not require a backend.
- Pathfinding uses four-directional movement across the grid.

## License

This project is available for learning and portfolio use. Add a formal license file if you want to specify permissions for reuse and redistribution.
