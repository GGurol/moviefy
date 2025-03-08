import { useEffect, useState } from "react";
import LatestUploads from "../LatestUploads";
import { getAppInfo } from "../../api/admin";
import MostRatedMovies from "../MostRatedMovies";
import { Card, CardContent, CardHeader } from "../ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const [appInfo, setAppInfo] = useState({
    movieCount: 0,
    reviewCount: 0,
    userCount: 0,
  });
  const { t } = useTranslation();

  const fetchAppInfo = async () => {
    const { appInfo, error } = await getAppInfo();
    if (error) return toast.error(t(error));
    setAppInfo({ ...appInfo });
  };

  useEffect(() => {
    fetchAppInfo();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-3 sm:gap-5 p-2 sm:p-5">
        <Card className="text-xs sm:text-lg">
          <CardHeader className="font-semibold">
            <span>{t("Total Uploads")}</span>
          </CardHeader>
          <CardContent>{appInfo.movieCount.toLocaleString()}</CardContent>
        </Card>
        <Card className="text-xs sm:text-lg">
          <CardHeader className="font-semibold">
            <span>{t("Total Reviews")}</span>
          </CardHeader>
          <CardContent>{appInfo.reviewCount.toLocaleString()}</CardContent>
        </Card>
        <Card className="text-xs sm:text-lg">
          <CardHeader className="font-semibold">
            <span>{t("Total Users")}</span>
          </CardHeader>
          <CardContent>{appInfo.userCount.toLocaleString()}</CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2 sm:gap-5 sm:p-5">
        <LatestUploads />
        <MostRatedMovies />
      </div>
    </>
  );
}
