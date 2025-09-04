'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Menggunakan komponen Button untuk konsistensi
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function LogoutDialog({ logoutDialogOpen, setLogoutDialogOpen, handleLogout }) {
  return (
    <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="flex flex-col items-center text-center p-8 gap-4">

          {/* Ikon Peringatan */}
          <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-3xl text-red-600"
            />
          </div>

          {/* Header dan Deskripsi */}
          <DialogHeader className="gap-2">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Anda Yakin Ingin Keluar?
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Anda akan dikeluarkan dari sesi aplikasi. Anda dapat masuk kembali kapan saja.
            </DialogDescription>
          </DialogHeader>

          {/* Tombol Aksi */}
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <Button
              variant="outline"
              size="lg"
              className="font-bold"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="font-bold"
              onClick={handleLogout}
            >
              Ya, Keluar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}