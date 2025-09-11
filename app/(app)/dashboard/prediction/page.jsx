"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "@/lib/axios";
import useCrud from "@/hooks/useCRUD";
import PredictionChart from "@/components/dashboard/PredictionChart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ContentTop from "@/components/ContentTop";
import { Icon } from "@iconify/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const PredictionPage = () => {
  const { toast } = useToast();
  // Mengambil data order aktual
  const {
    data: ordersData,
    fetchAllData: fetchOrders,
    loading: ordersLoading,
  } = useCrud("orders");
  

  // State untuk data dan status UI
  const [predictionData, setPredictionData] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null); // <-- STATE BARU untuk metrik
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true); // <-- STATE BARU untuk loading metrik
  const [isTraining, setIsTraining] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi mengambil data prediksi dari endpoint ARIMA
  const fetchPredictionData = async () => {
    setLoadingPredictions(true);
    setError(null);
    try {
      const response = await axios.get("/predictions/arima");
      setPredictionData(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data prediksi:", err);
      const errorMessage =
        err.response?.data?.error || "Tidak dapat memuat data prediksi dari server.";
      setError(errorMessage);
      toast({
        title: "Gagal Mengambil Prediksi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingPredictions(false);
    }
  };
  
  // <-- FUNGSI BARU untuk mengambil metrik evaluasi model -->
  const fetchModelMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const response = await axios.get("/predictions/arima/evaluate");
      setModelMetrics(response.data.metrics);
    } catch (err) {
      console.error("Gagal mengambil metrik model:", err);
      // Tidak perlu menampilkan toast error untuk ini agar tidak berlebihan
    } finally {
      setLoadingMetrics(false);
    }
  };

  // Mengoptimalkan pemrosesan data aktual untuk ditampilkan di chart
  console.log("Data mentah dari API (ordersData):", ordersData);
  const actualDataForChart = useMemo(() => {
    if (!ordersData || ordersData.length === 0) {
      return [];
    }
    // Menampilkan 60 hari terakhir data aktual untuk visualisasi yang lebih baik
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const filteredSales = ordersData.filter(
      (order) => new Date(order.created_at) >= sixtyDaysAgo
    );

    const dailySales = filteredSales.reduce((acc, order) => {
      const date = order.created_at.split("T")[0];
      acc[date] = (acc[date] || 0) + order.total_payment;
      return acc;
    }, {});

    return Object.entries(dailySales)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [ordersData]);

  // Memuat semua data saat komponen pertama kali dirender
  useEffect(() => {
    // Mengambil data order 1 tahun terakhir untuk memastikan data cukup
    fetchOrders({ status: "success", limit: 365 }); 
    fetchPredictionData();
    fetchModelMetrics(); // <-- Panggil fungsi baru
  }, []);

  // Fungsi untuk trigger training model ARIMA di backend
  const handleTrainModel = async () => {
    setIsTraining(true);
    toast({
      title: "Training Model Dimulai",
      description: "Model sedang dilatih ulang dengan data terbaru. Proses ini mungkin memakan waktu...",
    });
    try {
      await axios.post("/predictions/arima/train");
      toast({
        title: "Training Berhasil",
        description: "Model telah berhasil di-train ulang dan prediksi diperbarui.",
        variant: "success",
      });
      // Muat ulang data prediksi dan evaluasi setelah training
      await Promise.all([fetchPredictionData(), fetchModelMetrics()]);
    } catch (err) {
      console.error("Gagal melakukan training model:", err);
      toast({
        title: "Gagal Melakukan Training",
        description: err?.response?.data?.error || "Terjadi kesalahan saat mencoba melatih model.",
        variant: "destructive",
      });
    } finally {
      setIsTraining(false);
    }
  };

  // Fungsi untuk memperbarui semua data
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    toast({
      title: "Memperbarui Data",
      description: "Mengambil data penjualan dan prediksi terbaru...",
    });
    try {
      await Promise.all([
        fetchOrders({ status: "success", limit: 365 }),
        fetchPredictionData(),
        fetchModelMetrics(),
      ]);
    } catch (err) {
      // Toast untuk error sudah ditangani di dalam masing-masing fungsi fetch
    } finally {
      setIsRefreshing(false);
    }
  };

  const isLoading = ordersLoading || loadingPredictions;
  const isActionInProgress = isTraining || isRefreshing;

  // Komponen untuk menampilkan konten chart
  const ChartContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <Skeleton className="h-full w-full" />
        </div>
      );
    }
    if (error) {
      return (
        <Alert variant="destructive" className="my-8">
          <Icon icon="lucide:alert-triangle" className="h-5 w-5" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>
            {error} <br />
            Silakan coba lagi nanti atau hubungi administrator.
          </AlertDescription>
        </Alert>
      );
    }
    if (actualDataForChart.length === 0 && predictionData.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-96 text-center text-gray-500">
          <Icon icon="lucide:inbox" className="h-12 w-12 mb-4" />
          <p className="font-semibold">Data Tidak Ditemukan</p>
          <p className="text-sm">Belum ada data penjualan atau prediksi yang dapat ditampilkan.</p>
        </div>
      );
    }
    return <PredictionChart predictionData={predictionData} actualData={actualDataForChart} />;
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    return `Rp ${new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <ContentTop title="Analisis & Prediksi Penjualan" />

      {/* <-- KARTU BARU untuk Informasi & Metrik Model --> */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon icon="lucide:brain-circuit" className="mr-2 h-5 w-5" />
            Informasi & Akurasi Model Prediksi
          </CardTitle>
          <CardDescription>
            Metrik berikut mengukur tingkat akurasi model ARIMA berdasarkan data historis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-1">
            <p className="font-medium text-gray-500">Parameter Model</p>
            <p className="text-lg font-semibold">ARIMA (2, 1, 2)</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-500">MAE (Mean Absolute Error)</p>
            {loadingMetrics ? <Skeleton className="h-7 w-32" /> :
              <p className="text-lg font-semibold">{formatCurrency(modelMetrics?.mae)}</p>
            }
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-500">RMSE (Root Mean Squared Error)</p>
            {loadingMetrics ? <Skeleton className="h-7 w-32" /> :
              <p className="text-lg font-semibold">{formatCurrency(modelMetrics?.rmse)}</p>
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Grafik Prediksi Penjualan</CardTitle>
            <CardDescription>
              Perbandingan data penjualan aktual (60 hari terakhir) dengan prediksi (30 hari ke depan).
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={handleRefreshData} disabled={isActionInProgress}>
              <Icon icon="lucide:refresh-cw" className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Memuat..." : "Perbarui"}
            </Button>
            <Button onClick={handleTrainModel} disabled={isActionInProgress}>
              <Icon icon="lucide:brain-circuit" className={`mr-2 h-4 w-4 ${isTraining ? "animate-pulse" : ""}`} />
              {isTraining ? "Training..." : "Train Ulang Model"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContent />
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionPage;