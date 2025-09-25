import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { getActors, searchActor } from "../../api/actor";
import { useSearch } from "../../hooks";
import NextAndPrevButton from "../NextAndPrevButton";
import NotFoundText from "../NotFoundText";
import AppSearchForm from "../form/AppSearchForm";
import { DataTable } from "../ui/DataTable";
import { columns } from "./ActorListColumn";
import { useTranslation } from "react-i18next";

const limit = 9;

// CORRECTED: This component now correctly receives its data as props from AdminNavigator
export default function Actors({ actors, currentPage, totalActorCount, fetchActors, setCurrentPage }) {
  const { handleSearch, resetSearch, resultNotFound, results } = useSearch();
  const { t } = useTranslation();

  const handleOnNextClick = () => {
    const totalPages = Math.ceil(totalActorCount / limit);
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleOnPrevClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleOnSearchSubmit = (value) => {
    handleSearch(searchActor, value, [], results.setResults);
  };

  const handleSearchFormReset = () => {
    resetSearch();
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      fetchActors(0);
    }
  };
  
  const handleActionSuccess = () => {
    fetchActors(currentPage);
  };
  
  const noPrev = currentPage <= 0;
  const noNext = (currentPage + 1) * limit >= totalActorCount;
  
  return (
    <div className="p-2 sm:p-5">
      <div className="flex justify-end mb-5">
        <AppSearchForm
          onReset={handleSearchFormReset}
          onSubmit={handleOnSearchSubmit}
          placeholder={t("Search Actors...")}
          showResetIcon={results.length || resultNotFound}
        />
      </div>
      <NotFoundText text={t("No Actors Found")} visible={resultNotFound} />
      
      {/* CORRECTED: Pass the 'meta' prop directly to the DataTable */}
      <DataTable 
        columns={columns} 
        data={resultNotFound ? results : actors} 
        meta={{
          onActionSuccess: handleActionSuccess,
        }}
      />

      {!results.length && !resultNotFound ? (
        <NextAndPrevButton
          className="mt-5"
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
          noNext={noNext}
          noPrev={noPrev}
        />
      ) : null}
    </div>
  );
}