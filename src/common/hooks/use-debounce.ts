import {useEffect, useState} from "react";

export const useDebounce = <V>(value: V, timeout = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<V>(value)

  useEffect(() => {
    let timerId = setTimeout(() => {
      setDebouncedValue(value)
    }, timeout)

    return () => {
      clearTimeout(timerId)
    }
  }, [value])

  return debouncedValue
}