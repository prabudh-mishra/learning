import { useState, useEffect } from "react";
import axios from "axios";

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        // Set is used here to remove any duplicate titles. It is then converted back to array for operations
        setBooks((prevBooks) => {
          return [
            ...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)]),
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
        setError(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setLoading(false);
        setError(true);
      });

    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
}
