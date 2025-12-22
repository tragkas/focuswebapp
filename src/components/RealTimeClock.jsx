import { useState, useEffect } from 'react';
import FlipCard from './FlipCard';
import './RealTimeClock.css';

const RealTimeClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return { hours, minutes };
    };

    const { hours, minutes } = formatTime(time);

    return (
        <div className="real-time-clock">
            {/* 2 Cards Only: HH and MM */}
            <FlipCard digit={hours} />
            <div className="clock-separator"></div>
            <FlipCard digit={minutes} />
        </div>
    );
};

export default RealTimeClock;
