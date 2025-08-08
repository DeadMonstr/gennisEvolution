import React, {useCallback} from 'react';
import {usePagination,DOTS} from "hooks/usePagination";
import classNames from "classnames";


import "./pagination.sass"
import cls from "./pagination.module.sass";


const Pagination = React.memo(props => {



    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });
    
    const renderPageNumbers = useCallback(() => {
        return paginationRange.map((pageNumber,index) => {
            if (pageNumber === DOTS) {
                return <li key={index} className="pagination-item dots">&#8230;</li>;
            }

            return (
                <li
                    key={index}
                    className={classNames('pagination-item', {
                        selected: pageNumber === currentPage
                    })}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </li>
            );
        })
    },[currentPage, onPageChange, paginationRange])
    
    
    
    
    if (currentPage === 0 || paginationRange?.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange?.length - 1];
    
    
    
    const renderedPages = renderPageNumbers()


    return (
        <ul
            className={classNames('pagination-container', { [className]: className })}
        >
            <li
                key={10000}
                className={classNames('pagination-item arrow', {
                    disabled: currentPage === 1
                })}
                onClick={onPrevious}
            >
                <i className="fas fa-angle-left" />
            </li>
            <div className="numbers">
                {renderedPages}
            </div>

            <li
                key={100001}
                className={classNames('pagination-item arrow', {
                    disabled: lastPage ?  currentPage === lastPage : ""
                })}
                onClick={onNext}
            >
                <i className="fas fa-angle-right" />
            </li>
        </ul>
    );
})
export default Pagination;


export const ExtraPagination = ({
                                    currentPage,
                                    totalCount,
                                    pageSize,
                                    onPageChange,
                                    siblingCount = 1,
                                    className = "",
                                }) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const maxVisiblePages = 5;

    // Hooklarni ishlatishdan oldin return qila olmaymiz
    const getPageNumbers = useCallback(() => {
        let startPage = Math.max(
            currentPage - Math.floor(maxVisiblePages / 2),
            1
        );
        let endPage = startPage + maxVisiblePages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, maxVisiblePages, totalPages]);

    const pages = getPageNumbers();

    const renderPageNumbers = useCallback(() => {
        return pages.map((pageNumber,index) => {
            if (pageNumber === DOTS) {
                return <li key={index} className="pagination-item dots">&#8230;</li>;
            }

            return (
                <li
                    key={index}
                    className={classNames('pagination-item', {
                        selected: pageNumber === currentPage
                    })}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </li>
            );
        })
    },[currentPage, onPageChange])


    // Hooklardan keyin return qilsak bo‘ladi
    if (totalPages <= 1) return null;
    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };
    return (
        <ul
            className={classNames('pagination-container', { [className]: className })}
        >
            <li
                key={10000}
                className={classNames('pagination-item arrow', {
                    disabled: currentPage === 1
                })}
                onClick={onPrevious}
            >
                <i className="fas fa-angle-left" />
            </li>
            <div className="numbers">
                {renderPageNumbers()}
            </div>

            <li
                key={100001}
                className={classNames('pagination-item arrow', {
                    disabled: totalPages ?  currentPage === totalPages : ""
                })}
                onClick={onNext}
            >
                <i className="fas fa-angle-right" />
            </li>
        </ul>
    );
};