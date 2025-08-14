import React, {useMemo} from 'react';
import {useSelector} from "react-redux";

const useFilteredData = (data = [], currentPage, PageSize) => {

    const {filters} = useSelector(state => state.filters)
    const {search} = useSelector(state => state.accounting)
    console.log(filters , "log")


    const multiPropsFilter = useMemo(() => {
        const filterKeys = Object.keys(filters);

        return data?.filter(user => {
            return filterKeys?.every(key => {
                if (!filters[key]?.activeFilters?.length) return true;

                if (Array.isArray(user[key])) {
                    return user[key].some(keyEle =>
                        filters[key].activeFilters.some(
                            keyFil => keyFil.toLowerCase().includes(keyEle.toLowerCase())
                        )
                    );
                }

                if (Array.isArray(filters[key]?.activeFilters)) {
                    return filters[key].activeFilters.includes(user[key]);
                }

                return filters[key]?.activeFilters === user[key];
            });
        });
    }, [filters, data]);


    const searchedUsers = useMemo(() => {
        const filteredHeroes = data?.slice()
        return filteredHeroes?.filter(item => {
            if (item?.name || item.surname || item.username) {
                return item?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                item?.surname?.toLowerCase()?.includes(search?.toLowerCase()) ||
                item?.username?.toLowerCase()?.includes(search?.toLowerCase())
            } else return true
        })
    }, [data , search])





    // const memoized = useMemo(() => {
    //     const firstPageIndex = (currentPage - 1) * PageSize;
    //     const lastPageIndex = firstPageIndex + PageSize;
    //     return searchedUsers?.slice(firstPageIndex, lastPageIndex);
    // }, [PageSize, currentPage, searchedUsers])


    if (multiPropsFilter) {
        return [multiPropsFilter]
    }
    return [[],[]]


};

export default useFilteredData;