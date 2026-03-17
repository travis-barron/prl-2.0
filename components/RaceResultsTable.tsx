import Link from "next/link"

type Result = {
    finish: number
    start: number
    carNumber: number
    driver: string
    lapsCompleted: number
    lapsLed: number
    status: string
    id: number
}

export default function RaceResultsTable({ results }: { results: Result[] }) {
    const sorted = [...results].sort((a, b) => a.finish - b.finish)

    return (
        <div style={{ marginTop: 30 }}>
            <h3>Race Results</h3>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >
                <thead>
                    <tr>
                        <th align="left">Pos</th>
                        <th align="left">Driver</th>
                        <th align="left">#</th>
                        <th align="left">Start</th>
                        <th align="left">Diff</th>
                        <th align="left">Laps</th>
                        <th align="left">Led</th>
                        <th align="left">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {sorted.map((r) => (
                        <tr
                            key={r.finish}
                            style={{
                                fontWeight: r.finish === 1 ? "bold" : "normal"
                            }}
                        >
                            <td>{r.finish}</td>
                            <td>
                                <Link href={`/driver/${encodeURIComponent(r.id)}`}>
                                    {r.driver}
                                </Link>
                            </td>
                            <td>{r.carNumber}</td>
                            <td>{r.start}</td>
                            <td>{r.start - r.finish}</td>
                            <td>{r.lapsCompleted}</td>
                            <td>{r.lapsLed}</td>
                            <td>{r.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}