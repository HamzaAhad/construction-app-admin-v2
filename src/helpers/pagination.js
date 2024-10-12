import { useState } from "react";

import useSWR from "swr";

import apiClient from "@/helpers/interceptor";

const fetcher = async (url) => {
  const response = await apiClient.get(url);
  return response.data;
};

export const Pagination = (
  endpoint,
  initialPage = 1,
  query = "",
  field = "id"
) => {
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(query);
  const [filterField, setFilterField] = useState(field);

  const { data, error, isValidating } = useSWR(
    `${endpoint}?page=${page}&query=${searchQuery}&field=${filterField}`,
    fetcher,
    {
      revalidateOnFocus: false, // Optional: do not refetch when window regains focus
    }
  );

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return {
    data: data?.rows || [],
    error,
    isLoading: !data && isValidating,
    page,
    setPage,
    handleNextPage,
    handlePreviousPage,
    searchQuery,
    setSearchQuery,
    filterField,
    setFilterField,
    totalPages: data?.totalPages || 1, // Assuming your API returns total pages
  };
};
