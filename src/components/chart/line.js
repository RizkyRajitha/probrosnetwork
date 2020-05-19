import React from "react";
import { ResponsiveLine } from "@nivo/line";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const App = ({
  data,
  legendName,
  yscalemax,

  /* see data tab */
}) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 70, right: 40, bottom: 95, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: false,
      reverse: false,
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      fontSize: "18px",
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -60,
      legend: "Date",
      legendOffset: 68,
      legendPosition: "middle",
    }}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: legendName,
      legendOffset: -50,
      legendPosition: "middle",
    }}
    colors={{ scheme: "category10" }} //{linecolor}
    pointSize={4}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabel="y"
    pointLabelYOffset={-12}
    useMesh={true}
    theme={{
      axis: {
        ticks: { text: { fontSize: "1.4vmin" } },
        legend: { text: { fontSize: "1.4vmin" } },
      },
      legends: { text: { fontSize: "1.4vmin" } },
    }}
    legends={[
      {
        anchor: "top-left",
        direction: "column",
        justify: false,
        translateX: 10,
        translateY: 10,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

export default App;
