import React, { ReactElement, ReactNode } from "react";

interface PrintedComponentContainerProps {
  children: ReactNode;
}

export const PrintedComponentContainer = ({
  children,
}: PrintedComponentContainerProps): ReactElement => {
  return <div className="print-comp">{children}</div>;
};
