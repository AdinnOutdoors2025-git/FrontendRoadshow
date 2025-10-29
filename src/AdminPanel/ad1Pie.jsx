import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const data = [
    { name: "Week 1", value: 500 },
    { name: "Week 2", value: 340 },
    { name: "Week 3", value: 300 },
    { name: "Week 4", value: 340 }
];

const GRADIENT_IDS = ["gradientA", "gradientB", "gradientC", "gradientD"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    var x = cx + radius * Math.cos(-midAngle * RADIAN);
    var y = cy + radius * Math.sin(-midAngle * RADIAN);
    let rotateAngle = -midAngle; // Rotate text based on slice

    if (index === 0) {  // Week 1
        x = -15;
        y = -50;
        rotateAngle = 17;
    }
    if (index === 1) {  // Week 2
        x = 210;
        y = 160;
        rotateAngle = -56;
    }
    if (index === 2) {  // Week 3
        x = 170;
        y = 120;
        rotateAngle = -138;
    }
    if (index === 3) {  // Week 4
        x = 158;
        y = 75;
        rotateAngle = -60;
    }
    return (
        <text
            x={cx} // Start from the center
            y={cy}
            transform={`rotate(${rotateAngle}, ${x}, ${y}) translate(0, -${radius})`}
            textAnchor="middle"
            dominantBaseline="central"
            fill="black"
            style={{
                fontFamily: "Montserrat",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
            }}
        >
            {data[index].name}
        </text>
    );
};

export default function PieSection() {
    return (
        <PieChart width={400} height={400} >
            {/* SVG gradient definitions */}
            <defs>
                <linearGradient id="gradientA" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDB5DB" />
                    <stop offset="100%" stopColor="#C2D8FF" />
                </linearGradient>
                <linearGradient id="gradientB" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#71A4F4" />
                    <stop offset="100%" stopColor="#C9DEFF" />
                </linearGradient>
                <linearGradient id="gradientC" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#AEDDFB" />
                    <stop offset="100%" stopColor="#D0F6F9" />
                </linearGradient>
                <linearGradient id="gradientD" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5FDAEB" />
                    <stop offset="100%" stopColor="#BCFFF7" />
                </linearGradient>
            </defs>

            <Pie
                data={data}
                cx={130}
                cy={130}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={`url(#${GRADIENT_IDS[index % GRADIENT_IDS.length]})`}
                    />
                ))}
            </Pie>
        </PieChart>
    );
}
