"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

type RaceResult = {
  raceNumber: number
  finish: number
}

export default function DriverFinishChart({
  results
}: {
  results: RaceResult[]
}) {

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={results}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="raceNumber"
            label={{ value: "Race", position: "insideBottom", offset: -5 }}
          />

          <YAxis
            reversed
            allowDecimals={false}
            domain={[1, "dataMax"]}
            label={{ value: "Finish", angle: -90, position: "insideLeft" }}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="finish"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 5 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}