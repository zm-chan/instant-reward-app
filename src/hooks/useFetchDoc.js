import { useState } from "react";

export default function useFetchDoc({ queryFn, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  // const [data, setData] = useState({});

  async function query() {
    try {
      setIsLoading(true);
      setError(false);

      const data = await queryFn();

      onSuccess(data);

      // setData(data);
      setError(false);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    error,
    setError,
    query,
  };
}

// export default function useFetchDoc({ getData: queryFn }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [data, setData] = useState({});
//   const [refetch, setRefetch] = useState(true);

//   useEffect(() => {
//     async function fetchDoc() {
//       try {
//         setIsLoading(true);
//         setError(false);

//         const data = await queryFn();

//         setData(data);
//         setError(false);
//       } catch (error) {
//         console.log(error);
//         setError(true);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchDoc();
//   }, [queryFn, refetch]);

//   return {
//     isLoading,
//     error,
//     data,
//     setData,
//     setRefetch,
//   };
// }
