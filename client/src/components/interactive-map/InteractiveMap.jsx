/* eslint-disable react/prop-types */
import { useEffect } from "react";

const InteractiveMap = ({ news }) => {
    useEffect(() => {
        console.log(news)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <p className="text-center">Interactive Map</p>
}

export default InteractiveMap;