import { useState, useEffect } from "react";
const base_url = import.meta.env.VITE_SUPABASE_KEY || "http://localhost:4000/";

export const useFetch = (url: string) => {
  const [data, setData] = useState<null | any>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        const response = await fetch(base_url + url);
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setIsPending(false);
        setData(json);
        setError(null);
      } catch (error) {
        setError(`${error} Could not Fetch Data `);
      } finally {
        setIsPending(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, isPending, error };
};
