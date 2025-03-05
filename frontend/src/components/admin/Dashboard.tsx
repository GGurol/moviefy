import { useEffect, useState } from "react";
import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";
import { getAppInfo } from "../../api/admin";
import { useNotification } from "../../hooks";
import MostRatedMovies from "../MostRatedMovies";
import { Card, CardContent, CardHeader } from "../ui/card";
import { toast } from "sonner";

function Dashboard() {
  const [appInfo, setAppInfo] = useState({
    movieCount: 0,
    reviewCount: 0,
    userCount: 0,
  });

  const fetchAppInfo = async () => {
    const { appInfo, error } = await getAppInfo();
    if (error) return toast.error(error);
    setAppInfo({ ...appInfo });
  };

  useEffect(() => {
    fetchAppInfo();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-5 p-5">
        <Card>
          <CardHeader className="text-lg font-semibold">
            <span>Total Uploads</span>
          </CardHeader>
          <CardContent>{appInfo.movieCount.toLocaleString()}</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-lg font-semibold">
            <span>Total Reviews</span>
          </CardHeader>
          <CardContent>{appInfo.reviewCount.toLocaleString()}</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-lg font-semibold">
            <span>Total Users</span>
          </CardHeader>
          <CardContent>{appInfo.userCount.toLocaleString()}</CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-5 p-5">
        <LatestUploads />
        <MostRatedMovies />
      </div>
    </>
  );
}

export default Dashboard;
