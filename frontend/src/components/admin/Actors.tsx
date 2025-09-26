import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { searchActor } from "../../api/actor";
import { useSearch } from "../../hooks";
import NextAndPrevButton from "../NextAndPrevButton";
import NotFoundText from "../NotFoundText";
import AppSearchForm from "../form/AppSearchForm";
import { DataTable } from "../ui/DataTable";
import { columns as actorColumnsDefinition } from "./ActorListColumn";
import { useTranslation } from "react-i18next";

const limit = 9;

export default function Actors({ actors, currentPage, totalActorCount, fetchActors }) {
  const [results, setResults] = useState([]);
  const { handleSearch, resetSearch, resultNotFound } = useSearch();
  const { t } = useTranslation();
  
  const handleActionSuccess = () => {
    fetchActors(currentPage);
  };

  const columns = useMemo(() => actorColumnsDefinition.map(col => {
      if (col.id === 'actions') {
        return { ...col, meta: { onActionSuccess: handleActionSuccess } };
      }
      return col;
  }), [handleActionSuccess]);

  const handleOnNextClick = () => {
    const totalPages = Math.ceil(totalActorCount / limit);
    if (currentPage < totalPages - 1) {
      fetchActors(currentPage + 1);
    }
  };

  const handleOnPrevClick = () => {
    if (currentPage > 0) {
      fetchActors(currentPage - 1);
    }
  };
  
  const handleOnSearchSubmit = (value) => {
    handleSearch(searchActor, value, [], setResults);
  };

  const handleSearchFormReset = () => {
    resetSearch();
    setResults([]);
    fetchActors(0);
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
      
      <DataTable 
        columns={columns} 
        data={resultNotFound ? results : actors}
        meta={{ onActionSuccess: handleActionSuccess }}
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