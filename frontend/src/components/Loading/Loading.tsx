import React from 'react';
import "./Loading.css";

interface LoadingProps {

}


const Loading: React.FC<LoadingProps> = () => {
    const size = 40;

    return (
        <svg
            viewBox={`0 0 ${size} ${size}`}
            width={size}
            height={size}
            className="animate-spin"
        >
            <circle
                cx={size / 2}
                cy={size / 2}
                r={17.5}
                fill="transparent"
                stroke="#000"
                strokeWidth={5}
                strokeDasharray={190}
                strokeDashoffset={110}
            />
        </svg>
    );
};

export { Loading };
