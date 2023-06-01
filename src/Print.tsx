import React, {
  forwardRef,
  MutableRefObject,
  ReactElement,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { PrintedComponentContainer } from "$/PrintedComponentContainer";
import { createPortal } from "react-dom";
import { sleep } from "sleep-lightweight";

const FALLBACK_WIDTH = 800;
const MARGIN_TOP_DEFAULT = 120;
const MARGIN_LEFT_DEFAULT = 120;

interface PrintProps {
  children: ReactNode;
  onOpenPrintDialog?: () => void | Promise<void>;
  onClosePrintDialog?: () => void | Promise<void>;
  printWidth?: number;
  marginTop?: number;
  marginLeft?: number;
}

export const Print = forwardRef(
  (
    {
      children,
      printWidth,
      onOpenPrintDialog,
      onClosePrintDialog,
      marginLeft,
      marginTop,
    }: PrintProps,
    ref: MutableRefObject<{ openPrintDialog: () => Promise<void> }>
  ): ReactElement => {
    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    useEffect(() => {
      const afterPrint = async () => {
        if (onClosePrintDialog) {
          await onClosePrintDialog();
        }
        setPrintDialogOpen(false);
      };
      window.addEventListener("afterprint", afterPrint);

      return () => {
        window.removeEventListener("afterprint", afterPrint);
      };
    });

    const [dimensions, setDimensions] = useState<{
      width: number;
      height: number;
    }>();
    const elementRef = useRef(null);

    useEffect(() => {
      if (printWidth) {
        return;
      }

      const width: number = elementRef?.current?.clientWidth;
      const height: number = elementRef?.current?.clientHeight;
      if (width && height) {
        setDimensions({ width, height });
      } else {
        setDimensions({ width: FALLBACK_WIDTH, height: undefined });
      }
    }, []);

    const openPrintDialog = async () => {
      try {
        if (onOpenPrintDialog) {
          await onOpenPrintDialog();
        }
        setPrintDialogOpen(true);
        await sleep(500);
        window.print();
      } catch (e) {
        // do nothing
      }
    };

    useImperativeHandle(ref, () => ({
      openPrintDialog,
    }));

    return (
      <PrintedComponentContainer>
        {!printDialogOpen ? (
          <div ref={elementRef}>{children}</div>
        ) : (
          <>
            {createPortal(
              <div
                className="print-comp"
                style={{
                  width: printWidth ?? dimensions?.width,
                  height: printWidth ? undefined : dimensions?.height,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  marginTop: marginTop ?? MARGIN_TOP_DEFAULT,
                  marginLeft: marginLeft ?? MARGIN_LEFT_DEFAULT,
                }}
              >
                {children}
              </div>,
              document.body
            )}
            <style>{`* { visibility: hidden !important; } .print-comp, .print-comp * { visibility: visible !important}`}</style>
            )
          </>
        )}
      </PrintedComponentContainer>
    );
  }
);
