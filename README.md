# Data Viewer

## Introduction

Parse your data locally, features shown below:

![](demo.png)

## Usage

### Online

Visit the demo page: https://conanyu.github.io/data-viewer

### Local deployment

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)

1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/conanyu/data-viewer.git
cd data-viewer
```

2. Install project dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

After the server starts, you should see output similar to:

```
  VITE v5.0.0  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and visit `http://localhost:5173` to view the application.

### SDK

The Data Viewer SDK provides a React component for visualizing structured data in your applications.

#### Installation

```bash
pnpm add conanyu-data-viewer
```

#### Usage

```jsx
import DataViewer from "conanyu-data-viewer";

const data = {
  users: [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
    { id: 3, name: "Charlie", age: 35 },
  ],
  metadata: {
    createdAt: "2023-01-15",
    source: "API",
  },
};

const App = () => {
  return (
    <div>
      <h1>Data Viewer Demo</h1>
      <DataViewer data={JSON.stringify(data)} />
    </div>
  );
};
```

## License

This project is licensed under the MIT License.
