const CustomTreemapContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, colors, name, value, fill } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: fill || '#8884d8',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={10}
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                >
                    {name.split(' ')[0]}
                </text>
            )}
            {width > 50 && height > 50 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 12}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.8)"
                    fontSize={9}
                    style={{ pointerEvents: 'none' }}
                >
                    {(value / 1000000).toFixed(0)}M
                </text>
            )}
        </g>
    );
};
