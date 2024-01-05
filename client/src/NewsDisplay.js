// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { BiRefresh } from 'react-icons/bi';
// import ScrollToTop from "react-scroll-to-top";

// const NewsDisplay = () => {
//     const [newsData, setNewsData] = useState([]);
//     const [page, setPage] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [isFetching, setIsFetching] = useState(false);
//     const loaderRef = useRef(null);
//     const itemsPerPage = 20; // Set items per page to 20

//     // Fetch news from the API
//     const fetchNews = useCallback(async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`https://api.surajr.com.np/news?page=${page}&limit=${itemsPerPage}`);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const newData = await response.json();
//             if (newData.length > 0) {
//                 setNewsData((prevData) => {
//                     // Create a map to check for existing news items
//                     const existingIds = new Set(prevData.map(news => news._id));
//                     const filteredData = newData.filter(news => !existingIds.has(news._id));
//                     return [...prevData, ...filteredData];
//                 });
//                 setPage(prevPage => prevPage + 1); // Increment page for next fetch
//             }
//         } catch (error) {
//             console.error('Error fetching news:', error);
//         } finally {
//             setLoading(false);
//             setIsFetching(false);
//         }
//     }, [page]);

//     // Observer for infinite scroll
//     const handleObserver = useCallback(
//         (entities) => {
//             const target = entities[0];
//             if (target.isIntersecting && !loading && !isFetching) {
//                 setIsFetching(true);
//                 fetchNews();
//             }
//         },
//         [loading, isFetching, fetchNews]
//     );

//     useEffect(() => {
//         const observer = new IntersectionObserver(handleObserver, {
//             root: null,
//             rootMargin: '20px',
//             threshold: 1.0,
//         });
//         if (loaderRef.current) {
//             observer.observe(loaderRef.current);
//         }
//         return () => {
//             if (loaderRef.current) {
//                 observer.unobserve(loaderRef.current);
//             }
//         };
//     }, [handleObserver]);

//     // Refresh news
//     const handleRefresh = async () => {
//         setNewsData([]); // Clear existing news data
//         setPage(1); // Reset page to 1 for fresh data
//         await fetchNews();
//     };

//     // Default image in case of error
//     const getDefaultImage = () => {
//         return 'news.jpg';
//     };

//     // Truncate description for display
//     const truncateDescription = (description, wordLimit) => {
//         const words = description.split(' ');
//         if (words.length <= wordLimit) {
//             return description;
//         }
//         return words.slice(0, wordLimit).join(' ') + '...';
//     };

//     return (
//         <div className="container mt-5">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div className="d-flex align-items-center">
//                     <button className="btn btn-outline-secondary" onClick={handleRefresh}>
//                         <BiRefresh className="h-6 w-6" /> Refresh
//                     </button>
//                 </div>
//             </div>

//             <div className="row">
//                 {newsData.map((news) => (
//                     <div key={news._id} className="col-md-4 mb-4">
//                         <div className="card h-100">
//                             <img
//                                 src={news.img_url || getDefaultImage()}
//                                 alt={news.title}
//                                 className="card-img-top"
//                                 style={{ height: '200px', objectFit: 'cover' }}
//                                 onError={(e) => {
//                                     e.target.src = getDefaultImage();
//                                 }}
//                             />
//                             <div className="card-body">
//                                 <h5 className="card-title">{news.title}</h5>
//                                 <p className="card-text">
//                                     {news.description !== "No Description Found" 
//                                         ? truncateDescription(news.description, 20)
//                                         : "No description available."}
//                                 </p>
//                                 <p className="text-muted">
//                                     Source: {news.source} | Reading Time: {news.readingTime} min
//                                 </p>
//                             </div>
//                             <div className="card-footer">
//                                 <a
//                                     href={news.link}
//                                     className="btn btn-primary"
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                 >
//                                     Read More
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {loading && <p className="text-center">Loading...</p>}

//             <div ref={loaderRef} className="h-10" />
//             <ScrollToTop smooth />
//         </div>
//     );
// };

// export default NewsDisplay;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiRefresh } from 'react-icons/bi';
import ScrollToTop from "react-scroll-to-top";

const NewsDisplay = () => {
  const [newsData, setNewsData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [selectedModel, setSelectedModel] = useState('model1');
  const [selectedLength, setSelectedLength] = useState('short');
  const loaderRef = useRef(null);
  const itemsPerPage = 1000;
// fetch news from third party api
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.surajr.com.np/news?page=${page}&limit=${itemsPerPage}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newData = await response.json();
      if (newData.length > 0) {
        setNewsData((prevData) => {
          const existingIds = new Set(prevData.map(news => news._id));
          const filteredData = newData.filter(news => !existingIds.has(news._id));
          return [...prevData, ...filteredData];
        });
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [page]);

  const handleObserver = useCallback((entities) => {
    const target = entities[0];
    if (target.isIntersecting && !loading && !isFetching) {
      setIsFetching(true);
      fetchNews();
    }
  }, [loading, isFetching, fetchNews]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

  const handleRefresh = async () => {
    setNewsData([]);
    setPage(1);
    await fetchNews();
  };

  const getDefaultImage = () => {
    return 'https://images.unsplash.com/photo-1552012086-18eece80a2d9?q=80&w=2308&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length <= wordLimit) {
      return description;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const handleSummarize = async (url, newsId) => {
    setSummarizing(true);
    setCurrentSummary({ newsId, summary: 'Summarizing...' });

    try {
      const response = await fetch('/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, selectedModel, selectedLength }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCurrentSummary({ newsId, summary: data.summarized_text });
    } catch (error) {
      console.error('Error fetching summary:', error);
      setCurrentSummary({ newsId, summary: 'An error occurred while fetching the summary. Please try again.' });
    } finally {
      setSummarizing(false);
    }
  };

  const SummarizationOptions = () => (
    <div className="summarization-options mb-3">
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="modelSelect" className="form-label">Select Model</label>
          <select
            id="modelSelect"
            className="form-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="model1">mT5</option>
            <option value="model2">MBART</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="lengthSelect" className="form-label">Select Length</label>
          <select
            id="lengthSelect"
            className="form-select"
            value={selectedLength}
            onChange={(e) => setSelectedLength(e.target.value)}
          >
            <option value="short">Short</option>
            <option value="long">Long</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-secondary" onClick={handleRefresh}>
            <BiRefresh className="h-6 w-6" /> Refresh
          </button>
        </div>
      </div>

      <SummarizationOptions />

      <div className="row">
        {newsData.map((news) => (
          <div key={news._id} className="col-md-6 mb-4"> {/* Changed from col-md-4 to col-md-6 */}
            <div className="card h-100">
              <img
                src={news.img_url || getDefaultImage()}
                alt={news.title}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = getDefaultImage();
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{news.title}</h5>
                <p className="card-text">
                  {news.description !== "No Description Found" 
                    ? truncateDescription(news.description, 20)
                    : "No description available."}
                </p>
                <p className="text-muted">
                  Source: {news.source} | Reading Time: {news.readingTime} min
                </p>
                {currentSummary && currentSummary.newsId === news._id && (
                  <div className="mt-3">
                    <h6>Summary:</h6>
                    <p>{currentSummary.summary}</p>
                  </div>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <a
                  href={news.link}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleSummarize(news.link, news._id)}
                  disabled={summarizing}
                >
                  {summarizing && currentSummary && currentSummary.newsId === news._id ? 'Summarizing...' : 'Summarize'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center">Loading...</p>}

      <div ref={loaderRef} className="h-10" />
      <ScrollToTop smooth />
    </div>
  );
};

export default NewsDisplay;