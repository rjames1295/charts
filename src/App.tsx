import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip } from "recharts"
import { format, parseISO, subDays } from "date-fns"
import { FC, useEffect, useState } from "react"
import { Payload } from "recharts/types/component/DefaultTooltipContent"

import "./App.css"

interface Data {
    date: string
    value: number
}

const getRandomNumber = (min: number, max: number, toFixed = 3): number =>
    parseFloat((Math.random() * (max - min)).toFixed(toFixed))

const fetchData = async (): Promise<Data[]> => {
    return new Promise(resolve => {
        const __dummyData: Data[] = []
        for (let num = 30; num >= 0; num--) {
            __dummyData.push({
                date: subDays(new Date(), num).toISOString().substr(0, 10),
                value: getRandomNumber(5, 10000),
            })
        }

        resolve(__dummyData)
    })
}

const AreaChartPage: FC<{}> = () => {
    const [dummyData, setDummyData] = useState<Data[]>([])
    const [refetchIndex, setRefetchIndex] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)

    const generateDummyData = async () => {
        setLoading(true)
        setDummyData(await fetchData())
        setLoading(false)
    }

    useEffect(() => {
        generateDummyData()
    }, [refetchIndex])

    if (loading) return <></>

    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={dummyData}>
                    <defs>
                        <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="25%" stopColor="#2451B7" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#2451B7" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>

                    <Area type="monotone" dot={true} dataKey="value" stroke="#2451B7" fill="url(#color)" />

                    <XAxis
                        dataKey="date"
                        axisLine={true}
                        tickLine={true}
                        tickFormatter={str => {
                            const date = parseISO(str)
                            if (date.getDate() % 2 === 0) return format(date, "MMM, d")

                            return ""
                        }}
                        fill="white"
                        color="white"
                        fillOpacity={100}
                    />

                    <YAxis
                        dataKey="value"
                        axisLine={true}
                        tickLine={true}
                        tickCount={8}
                        tickFormatter={number => `$${number.toFixed(2)}`}
                    />

                    <Tooltip
                        content={({ active, payload, label }) => (
                            <AreaChartTooltip active={active} payload={payload} label={label} />
                        )}
                    />
                </AreaChart>
            </ResponsiveContainer>
            <div className="roll-dice-container">
                <button onClick={() => setRefetchIndex(prevState => prevState + 1)}>🎲 Roll Dice</button>
            </div>
        </>
    )
}

interface AreaChartTooltipProps {
    active?: boolean
    payload?: Payload<any, any>[]
    label?: string
}

const AreaChartTooltip: FC<AreaChartTooltipProps> = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="tooltip">
                <h4>{label && format(parseISO(label || ""), "eeee, d MMM, yyyy")}</h4>
                <p>{payload?.[0]?.value?.toFixed?.(2)} BHD</p>
            </div>
        )
    }

    return null
}

export default AreaChartPage
