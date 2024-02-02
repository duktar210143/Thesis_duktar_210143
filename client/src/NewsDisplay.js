import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiRefresh } from 'react-icons/bi';
import ScrollToTop from "react-scroll-to-top";

const NewsDisplay = () => {
    const [newsData, setNewsData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const loaderRef = useRef(null);
    const itemsPerPage = 20; // Set items per page to 20

    // Fetch news from the API
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
                    // Create a map to check for existing news items
                    const existingIds = new Set(prevData.map(news => news._id));
                    const filteredData = newData.filter(news => !existingIds.has(news._id));
                    return [...prevData, ...filteredData];
                });
                setPage(prevPage => prevPage + 1); // Increment page for next fetch
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }, [page]);

    // Observer for infinite scroll
    const handleObserver = useCallback(
        (entities) => {
            const target = entities[0];
            if (target.isIntersecting && !loading && !isFetching) {
                setIsFetching(true);
                fetchNews();
            }
        },
        [loading, isFetching, fetchNews]
    );

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

    // Refresh news
    const handleRefresh = async () => {
        setNewsData([]); // Clear existing news data
        setPage(1); // Reset page to 1 for fresh data
        await fetchNews();
    };

    // Default image in case of error
    const getDefaultImage = () => {
        return 'news.jpg';
    };

    // Truncate description for display
    const truncateDescription = (description, wordLimit) => {
        const words = description.split(' ');
        if (words.length <= wordLimit) {
            return description;
        }
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button className="btn btn-outline-secondary" onClick={handleRefresh}>
                        <BiRefresh className="h-6 w-6" /> Refresh
                    </button>
                </div>
            </div>

            <div className="row">
                {newsData.map((news) => (
                    <div key={news._id} className="col-md-4 mb-4">
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
                            </div>
                            <div className="card-footer">
                                <a
                                    href={news.link}
                                    className="btn btn-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Read More
                                </a>
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