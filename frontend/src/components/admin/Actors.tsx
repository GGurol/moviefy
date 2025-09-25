import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { getActors, searchActor } from "../../api/actor";
import { useSearch } from "../../hooks";
import NextAndPrevButton from "../NextAndPrevButton";
import NotFoundText from "../NotFoundText";
import AppSearchForm from "../form/AppSearchForm";
import { DataTable } from "../ui/DataTable";
import { columns } from "./ActorListColumn"; // Use the new column definitions
import { useTranslation } from "react-i18next";

const limit = 9;

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalActorCount, setTotalActorCount] = useState(0);
  const { handleSearch, resetSearch, resultNotFound } = useSearch();
  const { t } = useTranslation();

  const fetchActors = useCallback(async (pageNo) => {
    const { profiles, error, totalActorCount } = await getActors(pageNo, limit);
    if (error) return toast.error(t(error));
    setActors(profiles || []);
    setTotalActorCount(totalActorCount || 0);
  }, [t]);

  useEffect(() => {
    fetchActors(currentPage);
  }, [currentPage, fetchActors]);
  
  const handleActionSuccess = () => {
    fetchActors(currentPage);
  };

  const tableColumns = useMemo(() => columns.map(col => {
      if (col.id === 'actions') {
        return { ...col, meta: { onActionSuccess: handleActionSuccess } };
      }
      return col;
  }), [handleActionSuccess]);

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
    handleSearch(searchActor, value, [], setResults);
  };

  const handleSearchFormReset = () => {
    resetSearch();
    setResults([]);
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      fetchActors(0);
    }
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
      
      <DataTable columns={tableColumns} data={resultNotFound ? results : actors} />

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