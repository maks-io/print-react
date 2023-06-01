# print-react 🖨️

[![Version](https://img.shields.io/npm/v/print-react)](https://www.npmjs.com/package/print-react)

Lightweight component wrapper to print the wrapped component when desired

## Highlights

- print individual react component(s)
- lightweight
- fully written in TypeScript

## Install

```
npm install --save print-react
```

Or if you use Yarn:

```
yarn add print-react
```

## Usage

Detailed documentation coming soon.
An example usage would be:

```tsx
import { Print } from "print-react";

export const MyExampleParentComponent = () => {
  const ref = useRef<{ openPrintDialog: () => Promise<void> }>();

  // use the following line only if you need to 'react' to the dialog state change:
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  return (
    <div>
      <Print
        ref={ref}
        printWidth={420}
        marginTop={48}
        marginLeft={64}
        onOpenPrintDialog={() => {
          setPrintDialogOpen(true);
        }}
        onClosePrintDialog={() => {
          setPrintDialogOpen(false);
        }}
      >
        <MyComponentIWantToPrint />
      </Print>
      <button
        onClick={async () => {
          await ref.current.openPrintDialog();
        }}
      >
        Click to print!
      </button>
    </div>
  );
};
```
