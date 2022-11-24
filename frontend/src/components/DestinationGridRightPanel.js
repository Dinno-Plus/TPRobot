import { useMemo } from "react";

import { BottomButton, DestinationGrid, MiniPaper } from "./";

export const DestinationGridRightPanel = ({
  color = "blue",
  miniPaperProps = {
    icon: "i",
    content: "miniPaperContent",
  },
  destinationGridProps = {
    mapName: "",
    destinations: [], // should be passed to avoid infinite loops
    badge: "order",
    onClick: () => console.log("click"),
    onChange: null,
    onAdd: null,
  },
  bottomButtonProps = {
    label: "bottomButtonLabel",
    labelAlign: "center",
    icon: "i",
    disabled: false,
    onClick: () => {},
  },
}) => {
  const { mapName, destinations, badge, onClick, onChange, onAdd } =
    destinationGridProps;
  const memorizedDestinationGrid = useMemo(
    () => (
      <DestinationGrid
        {...{ color, mapName, destinations, badge, onClick, onChange, onAdd }}
      />
    ),
    [color, mapName, destinations, badge, onClick, onChange, onAdd]
  );

  return (
    <>
      <MiniPaper {...{ color, ...miniPaperProps }} />
      {memorizedDestinationGrid}
      {/* <DestinationGrid {...{ color, ...destinationGridProps }} /> */}
      <BottomButton {...{ color, ...bottomButtonProps }} />
    </>
  );
};
