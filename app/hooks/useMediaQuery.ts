import { useEffect, useState } from "react";

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);
  
    useEffect(() => {
      const mediaQueryList = window.matchMedia(query);
      const updateMatch = () => setMatches(mediaQueryList.matches);
  
      updateMatch(); // Set the initial value
      mediaQueryList.addEventListener("change", updateMatch);
  
      return () => mediaQueryList.removeEventListener("change", updateMatch);
    }, [query]);
  
    return matches;
};

export default useMediaQuery;