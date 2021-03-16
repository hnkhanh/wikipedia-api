import "./App.scss";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import RenderPages from './RenderPages'
import Loading from './Loading'

export default function App() {
  
  const [query, setQuery] = useState("");
  const [addingPages, setAddingPages] = useState(0);
  const [pages, setPages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const URL =
    "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=imageinfo%7Cextracts%7Cpageimages%7Cinfo&generator=search&exlimit=20&exintro=1&explaintext=1&piprop=thumbnail%7Cname%7Coriginal&pilimit=max&inprop=url&exsentences=1&gsrlimit=15";
  const myFetch = useRef(() => {});
  let cancel;

  function handleSearch(e) {
    setQuery(e.target.value);
  }

  const compare = (a, b) => {
    if (a.index < b.index) return -1;
    if (a.index > b.index) return 1;
    return 0;
  }

  const getPagesArray = (res) => {
    return Object.entries(res.data.query.pages)
      .flat()
      .filter((_, idx) => idx % 2 !== 0)
      .sort(compare);
  }

  const removeDuplicates = (arr) => {
    return arr.filter(
      (page, index, self) =>
        index === self.findIndex((p) => p.pageid === page.pageid)
    );
  }

  myFetch.current = async () => {
    setLoading(true)
    try {
      let res = await axios
      .get(URL, {
        params: {
          gsrsearch: query,
          gsroffset: addingPages
        },
        cancelToken: new axios.CancelToken((c) => (cancel = c))
      })

      if (!res.data.query) setError(true)
       else {
        let data = getPagesArray(res)
        if (data.length < 15) setHasMore(false)
        let nextPages = await axios
          .get(URL, {
          params: {
            gsrsearch: query,
            gsroffset: addingPages + 15
          }
        })
        if(!nextPages.data.query) setHasMore(false)
        if (addingPages === 0) setPages(data)
         else {
          let newPages = removeDuplicates([...pages, ...data]);
          setPages(newPages);
        }
      }
      setLoading(false);
    } catch (e) {
      if (axios.isCancel(e)) return
      setError(true)
    }
  }

  const nextFetch = async () => {
    setAddingPages((prevPages) => prevPages + 15);
    myFetch.current();
  }

  useEffect(() => {
    setPages([]);
    setHasMore(true);
    setAddingPages(0);
    myFetch.current();
    return () => cancel();
  }, [query, cancel]);

  return (
    <div className="App">
      <h1 className="white-text">Wikipedia Search API</h1>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Searching for something?"
        />
        <span onClick={() => setQuery("") }></span>
      </div>
      {error && query && !pages.length && !loading ?
        <img src="https://runwaycamp.cz/images/morpheus_meme.jpg" className="not-found" alt="not-found"/> :
        <InfiniteScroll
          dataLength={pages.length}
          loader={query && loading && <Loading />}
          next={nextFetch}
          hasMore={hasMore}
          endMessage={
            !hasMore && !loading && (
              <p style={{ textAlign: "center", marginBottom: '40px'}}>
                <b>Nothing else to see here.</b>
              </p>
          )}>
          <RenderPages pages={pages} />
        </InfiniteScroll>
      }
    </div>
  );
}
