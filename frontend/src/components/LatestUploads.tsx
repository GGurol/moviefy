import { useEffect, useState } from "react";
import { deleteMovie, getMovieForUpdate, getMovies } from "../api/movie";
import { useMovies, useNotification } from "../hooks";
import MovieListItem from "./MovieListItem";
import ConfirmModal from "./modals/ConfirmModal";
import UpdateMovie from "./modals/UpdateMovie";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useTranslation } from "react-i18next";

const pageNo = 0;
const limit = 3;

function LatestUploads() {
  const [movies, setMovies] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();

  const { fetchLatestUploads, latestUploads } = useMovies();

  useEffect(() => {
    fetchLatestUploads(limit);
  }, []);

  const handleUIUpdate = () => fetchLatestUploads(limit);

  return (
    <Card className="">
      <CardHeader className="text-lg font-semibold">
        <span>{t("Recent Uploads")}</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {latestUploads.map((movie) => {
            return (
              <MovieListItem
                movie={movie}
                key={movie.id}
                // onDeleteClick={() => handleOnDeleteClick(movie)}
                // onEditClick={() => handleOnEditClick(movie)}
                afterDelete={handleUIUpdate}
                afterUpdate={handleUIUpdate}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default LatestUploads;
