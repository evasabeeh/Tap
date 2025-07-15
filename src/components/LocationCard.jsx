import { useEffect, useRef, useState } from 'react';

export default function LocationCard({ place }) {
    const ref = useRef();
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition duration-700 ease-in-out transform hover:scale-105 hover:bg-[#FAF7F0]
            ${isVisible ? 'opacity-100' : 'opacity-0'} 
             px-4 lg:px-6 py-8 lg:py-10 rounded-lg shadow-2xl`}
        >
            <h2 className="text-lg font-semibold">{place.display_name}</h2>
            <p className="text-gray-600">Type: {place.type}</p>
        </div>
    );

}
