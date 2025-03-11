import { useCallback, useState } from "react";
import { Cards } from "../Cards";

export const useLocalStorage = (key, initialValue, type) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue(value);
        const stringifiedValue = JSON.stringify(value);
        window.localStorage.setItem(key, stringifiedValue);
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
