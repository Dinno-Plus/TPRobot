import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Button, useTheme } from "@mui/material";
import { capitalize } from "../utils";
import { BatteryCharging60Icon, HomeIcon } from "./icons";

const dragTimeout = 500; //ms
const draggingSwipeInterval = 750; //ms
let draggingSwipeIntervalTimer;

export const DestinationGrid = ({
  color = "blue",
  mapName = "",
  destinations, // should be passed to avoid infinite loops
  badge = "order",
  onClick: handleClick,
  onChange: handleChange,
  onAdd: handleAdd,
}) => {
  const containerRef = useRef(null);
  const gridsRef = useRef(null);
  const draggingButtonRef = useRef(null);

  const [containerRect, setContainerRect] = useState(null); // DOMRect
  const [prevMapName, setPrevMapName] = useState(mapName);
  const [numPages, setNumPages] = useState(
    parseInt((destinations.length - (handleAdd ? 0 : 1)) / 12) + 1
  );

  const [destinationsPlus, setDestinationsPlus] = useState([]);
  const [page, setPage] = useState(0);
  const [action, setAction] = useState({
    state: "none", // none, start, continue, end
    type: "none", // none, swipe, drag
    startPosition: { x: 0, y: 0 },
    target: null,
  });
  const theme = useTheme();

  const [
    gridsTMargin,
    gridsHMargin,
    containerBorderWidth,
    columnGap,
    rowGap,
    buttonWidth,
    buttonHeight,
    gridWidth,
    gridHeight,
    gridGap,
    getGridsWidth,
    getButtonX,
    getButtonY,
  ] = useMemo(() => {
    const hFactor = window.innerWidth / 1920;
    const vFactor = window.innerHeight / 1200;

    const gridsTMargin = (numPages > 1 ? 20 : 18) * vFactor;
    const gridsHMargin = (numPages > 1 ? 65.5 : 29.5) * hFactor;
    const containerBorderWidth = 12 * vFactor;
    const gridGap = 36 * hFactor;

    const columnGap = 20 * hFactor;
    const rowGap = 24 * vFactor;
    const buttonWidth = (numPages > 1 ? 216 : 240) * hFactor;
    const buttonHeight = (numPages > 1 ? 104 : 112) * vFactor;
    const gridWidth = buttonWidth * 3 + columnGap * 2; // 688
    const gridHeight = buttonHeight * 4 + rowGap * 3;

    const getGridsWidth = (numPages) =>
      gridWidth * numPages + gridGap * (numPages - 1);
    const getButtonX = (i) =>
      (buttonWidth + columnGap) * (i % 3) +
      parseInt(i / 12) * (gridWidth + gridGap);
    const getButtonY = (i) => parseInt((i % 12) / 3) * (buttonHeight + rowGap);
    return [
      gridsTMargin,
      gridsHMargin,
      containerBorderWidth,
      columnGap,
      rowGap,
      buttonWidth,
      buttonHeight,
      gridWidth,
      gridHeight,
      gridGap,
      getGridsWidth,
      getButtonX,
      getButtonY,
    ];
  }, [numPages]);

  useLayoutEffect(() => {
    const { top, right, bottom, left, width, height } =
      containerRef.current.getBoundingClientRect();
    const borderWidth = containerRef.current.clientLeft;
    const vPadding = gridsRef.current.offsetTop + borderWidth; // depends on numPages (0 or > 0)
    const hPadding = gridsRef.current.offsetLeft + borderWidth; // depends on numPages (0 or > 0)
    setContainerRect({
      top,
      right,
      bottom,
      left,
      width,
      height,
      hPadding,
      vPadding,
      borderWidth,
    });
  }, [numPages]);

  useLayoutEffect(() => {
    const newNumPage =
      parseInt((destinations.length - (handleAdd ? 0 : 1)) / 12) + 1;

    // destinations changed => numPages changed => set new numPages
    if (numPages !== newNumPage) {
      setNumPages(newNumPage);
    }
    // map changed => go to the init (0 or last) page
    if (mapName !== prevMapName) {
      setPage(handleAdd ? newNumPage - 1 : 0);
      setPrevMapName(mapName);
    }
    // dest added => go to the last page (Don't count the add Button)
    if (handleAdd && destinations.length - destinationsPlus.length === 1) {
      setPage(parseInt((destinations.length - 1) / 12));
      gridsRef.current.style.transition = `transform 0.2s`;
      setTimeout(() => gridsRef.current.removeAttribute("style"), 200);
    }
  }, [
    mapName,
    prevMapName,
    numPages,
    destinations,
    destinationsPlus,
    handleAdd,
  ]);

  useLayoutEffect(() => {
    setDestinationsPlus(
      destinations.map((d, i) => ({
        ...d,
        i,
        badges:
          badge === "order"
            ? d.order
            : badge === "type" && d.type === "home"
            ? [<HomeIcon />]
            : badge === "type" && d.type === "charge"
            ? [<BatteryCharging60Icon />]
            : [],
      }))
    );
  }, [destinations, badge]);

  // set action.type to "drag"
  useEffect(() => {
    let dragTimeoutTimer;
    if (
      handleChange &&
      action.state === "start" &&
      action.target.type === "button" &&
      !action.target.name.includes("추가 +")
    ) {
      dragTimeoutTimer = setTimeout(() => {
        setAction((action) => ({ ...action, type: "drag" }));
        action.target.classList.add("dragging");
        const { left, top } = action.target.getBoundingClientRect();
        const { left: cLeft, top: cTop, borderWidth: cBW } = containerRect;
        draggingButtonRef.current.innerHTML = action.target.innerHTML;
        draggingButtonRef.current.classList.add("dragging");
        draggingButtonRef.current.style.left = `${left - cLeft - cBW}px`;
        draggingButtonRef.current.style.top = `${top - cTop - cBW}px`;
      }, dragTimeout);
    }

    return () => clearTimeout(dragTimeoutTimer);
  }, [
    handleChange,
    action.state,
    action.target,
    containerRect,
    containerBorderWidth,
  ]);

  const handlePointerDown = (e) => {
    setAction({
      state: "start",
      type: "swipe",
      startPosition: { x: e.clientX, y: e.clientY },
      target: e.target,
    });
  };
  const handlePointerMove = (e) => {
    if (action.state !== "start" && action.state !== "continue") {
      return;
    }

    if (action.state === "start") {
      setAction((action) => ({ ...action, state: "continue" }));
    }

    const { clientX: x, clientY: y } = e;
    // 터치 시 pointerLeave bug fix를 위한 if
    if (
      x < containerRect.left ||
      x > containerRect.right ||
      y < containerRect.top ||
      y > containerRect.bottom
    ) {
      handlePointerUp(e);
      return;
    }

    if (action.type === "drag") {
      // drag
      const newX = (x - action.startPosition.x) / 1.05;
      const newY = (y - action.startPosition.y) / 1.05;
      draggingButtonRef.current.style.transform = `scale(1.05) translate(${newX}px, ${newY}px)`;

      // swipeWhileDrag
      const left = x < containerRect.left + containerRect.hPadding;
      const right = x > containerRect.right - containerRect.hPadding;
      clearInterval(draggingSwipeIntervalTimer);
      if (left || right) {
        draggingSwipeIntervalTimer = setInterval(() => {
          if (left) {
            setPage((page) => (page > 0 ? page - 1 : page));
            gridsRef.current.style.transition = `transform 0.2s`;
            setTimeout(() => gridsRef.current.removeAttribute("style"), 200);
          } else if (right) {
            setPage((page) => (page < numPages - 1 ? page + 1 : page));
            gridsRef.current.style.transition = `transform 0.2s`;
            setTimeout(() => gridsRef.current.removeAttribute("style"), 200);
          }
        }, draggingSwipeInterval);
      }

      // order change
      const localX = x - (containerRect.left + containerRect.hPadding);
      const localY = y - (containerRect.top + containerRect.vPadding);
      if (
        localX > 0 &&
        localX < gridWidth &&
        localY > 0 &&
        localY < gridHeight
      ) {
        const fromIdx = destinationsPlus.findIndex(
          (d) => d.name === draggingButtonRef.current.innerText
        );
        const toIdx = Math.min(
          page * 12 +
            parseInt((localY + rowGap / 2) / (buttonHeight + rowGap)) * 3 +
            parseInt((localX + columnGap / 2) / (buttonWidth + columnGap)),
          destinationsPlus.length - 1
        );

        setDestinationsPlus((ds) =>
          ds.map((d, i) => {
            let idx = i;
            if (fromIdx < toIdx) {
              if (i === fromIdx) idx = toIdx;
              else if (i > fromIdx && i <= toIdx) idx = i - 1;
            } else if (toIdx < fromIdx) {
              if (i === fromIdx) idx = toIdx;
              else if (i >= toIdx && i < fromIdx) idx = i + 1;
            }
            return { ...d, i: idx };
          })
        );
      }
    } else if (action.type === "swipe") {
      // swipe
      const newX = -(gridWidth + gridGap) * page - (action.startPosition.x - x);
      gridsRef.current.style.transform = `translateX(${newX}px)`;
    }
  };
  const handlePointerUp = (e) => {
    if (action.state === "continue" || action.state === "start") {
      if (action.type === "drag") {
        // drag
        clearInterval(draggingSwipeIntervalTimer);
        action.target.classList.remove("dragging");
        draggingButtonRef.current.classList.remove("dragging");
        draggingButtonRef.current.removeAttribute("style");
        draggingButtonRef.current.name = "";

        handleChange([...destinationsPlus].sort((a, b) => a.i - b.i));
      } else if (action.type === "swipe") {
        // swipe
        const xDifference = action.startPosition.x - e.clientX;
        let newPage = page;
        if (xDifference > containerRect.width / 10 && page < numPages - 1) {
          newPage = page + 1;
        } else if (xDifference < -containerRect.width / 10 && page > 0) {
          newPage = page - 1;
        }
        setPage(newPage);
        gridsRef.current.style.transform = `translateX(${
          -(gridWidth + gridGap) * newPage
        }px)`;
        gridsRef.current.style.transition = `transform 0.2s`;
        setTimeout(() => gridsRef.current.removeAttribute("style"), 200);
      }
      setAction((action) => ({ ...action, state: "end" }));
    } else {
      setAction({
        state: "none",
        type: "none",
        startPosition: { x: 0, y: 0 },
        target: null,
      });
    }
  };
  const handleAddClick = () => {
    handleAdd("none");
  };
  const handleDestinationClick = (e) => {
    handleClick(destinationsPlus.find((d) => d.name === e.target.name));
  };

  return (
    <Box
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDragStart={(e) => e.preventDefault()}
      sx={{
        flex: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderRadius: `${20 / 12}vh`, //  20,
        border: `${containerBorderWidth}px solid ${theme.palette[color]}`,
        overflow: "scroll",
        width: "100%",
        "& > .grids": {
          flex: 1,
          position: "relative",
          margin: `${gridsTMargin}px ${gridsHMargin}px ${0}px`,
          width: `${getGridsWidth(numPages)}px`,
          touchAction: "none",
          transform: `translateX(${-(gridWidth + gridGap) * page}px)`,
          "& > button": {
            position: "absolute",
            width: buttonWidth,
            height: buttonHeight,
            transition: "transform",
            transitionDuration: action.type === "drag" ? "0.5s" : "0s",
            "&.dragging": { opacity: 0 },
          },
        },
        "& > .pagination": {
          display: "flex",
          gap: `${16 / 19.2}vw`, //  16,
          margin: `${16 / 12}vh auto ${16 / 12}vh`, // `${16}px auto ${16}px`,
          "& > div": {
            width: `${12 / 19.2}vw`, //  12,
            height: `${12 / 12}vh`, //  12,
            borderRadius: "50%",
            background: theme.palette.grey[600],
            "&.active": { background: "white" },
          },
        },
        "& > .draggingButton": {
          position: "absolute",
          width: buttonWidth,
          height: buttonHeight,
          background: theme.palette.grey[700],
          transform: "scale(1.05)",
          opacity: 0,
          zIndex: -1000,
          "&:hover": { background: theme.palette.grey[700] },
          "&.dragging": { opacity: 1, zIndex: 0 },
        },
      }}
    >
      <div className="grids" ref={gridsRef}>
        {destinationsPlus.map((d) => (
          <DestinationButton
            key={d.name}
            color={color}
            style={{
              transform: `translate(${getButtonX(d.i)}px,${getButtonY(d.i)}px)`,
            }}
            selected={d.selected}
            onClick={handleDestinationClick}
            badges={d.badges}
            name={d.name}
          >
            {d.name}
          </DestinationButton>
        ))}
        {handleAdd && (
          <AddButton
            style={{
              transform:
                destinations.length > 0
                  ? `translate(${getButtonX(
                      destinationsPlus.length
                    )}px,${getButtonY(destinationsPlus.length)}px)`
                  : `translate(${(gridWidth - buttonWidth) / 2}px,${
                      (gridHeight - buttonHeight) / 2
                    }px)`,
            }}
            onClick={handleAddClick}
            name="추가 +"
          />
        )}
      </div>
      {numPages > 1 && (
        <div className="pagination">
          {[...new Array(numPages)].map((_, pageIdx) => (
            <div key={pageIdx} className={page === pageIdx ? "active" : ""} />
          ))}
        </div>
      )}
      <DestinationButton
        color={color}
        className="draggingButton"
        ref={draggingButtonRef}
      />
    </Box>
  );
};

const DestinationButton = forwardRef(
  ({ color, selected, badges, children, ...props }, ref) => {
    const theme = useTheme();

    return (
      <>
        <Button
          disableRipple
          ref={ref}
          sx={{
            padding: 0,
            fontSize: `${40 / 12}vh`, // 40,
            fontWeight: selected ? 700 : 400,
            borderRadius: `${20 / 12}vh`, // 20,
            boxShadow: theme.shadows[16],
            background: theme.palette.grey[850],
            color: selected
              ? theme.palette[`mid${capitalize(color)}`]
              : "white",
            border: selected
              ? `${2 / 12}vh solid ${theme.palette[`mid${capitalize(color)}`]}` //`2px solid ${theme.palette[`mid${capitalize(color)}`]}`
              : "none",
            "&:hover": { background: theme.palette.grey[850] },
            "& > div": {
              display: "flex",
              position: "absolute",
              top: `${(selected ? -18 : -16) / 12}vh`, // selected ? -18 : -16,
              right: `${(selected ? -18 : -16) / 19.2}vw`, // selected ? -18 : -16,
              gap: `${4 / 19.2}vw`, // 4,
              "& > div": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: `${48 / 19.2}vw`, //  48,
                height: `${48 / 12}vh`, // 48,
                borderRadius: "50%",
                background: theme.palette[color],
                fontSize: `${32 / 12}vh`, // 32,
                fontWeight: 700,
                color: "white",
                "& > svg": {
                  width: `${28 / 19.2}vw`, //  28,
                  height: `${28 / 12}vh`, //  28,
                },
              },
            },
          }}
          {...props}
        >
          {children}
          {badges && badges.length > 0 && (
            <div>
              {badges.map((badge, i) => (
                <div key={i}>{badge}</div>
              ))}
            </div>
          )}
        </Button>
      </>
    );
  }
);

const AddButton = (props) => {
  const theme = useTheme();

  return (
    <Button
      sx={{
        fontSize: `${40 / 12}vh`, // 40,
        fontWeight: 400,
        borderRadius: `${20 / 12}vh`, //  20,
        boxShadow: theme.shadows[16],
        color: theme.palette.text.lightGrey,
        border: `${2 / 12}vh solid ${theme.palette.grey[600]}`, //`2px solid ${theme.palette.grey[600]}`,
        background: "transparent",
        "&:hover": { background: "transparent" },
      }}
      {...props}
    >
      추가 +
    </Button>
  );
};
