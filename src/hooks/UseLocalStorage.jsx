import { useCallback, useState } from "react";
import { Cards } from "../Cards";

const useLocalStorage = (key, initialValue, type) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } else {
        return initialValue;
      }
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue(value);
        if (typeof window !== "undefined") {
          const stringifiedValue = JSON.stringify(value);
          window.localStorage.setItem(key, stringifiedValue);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key]
  );

  return [
    type === "card"
      ? storedValue.map((element) => new Cards().cloneWithChanges(element))
      : storedValue,
    setValue,
  ];
};

export default useLocalStorage