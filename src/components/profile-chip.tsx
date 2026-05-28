"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAvatar, deleteParticipant, fetchParticipants } from "@/lib/participants-queries";

const AUTH_KEY = "travel_auth";
const DEVICE_KEY = "travel_device_id";

export function ProfileChip() {
  const [profile, setProfile] = useState<{ name: string; deviceId: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    setProfile(stored ? JSON.parse(stored) : null);
  }, []);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: participants = [] } = useQuery({
    queryKey: ["participants"],
    queryFn: fetchParticipants,
  });

  if (!profile) return null;

  const me = participants.find((p) => p.id === profile.deviceId);

  const handleLeave = async () => {
    if (me?.photo_url) await deleteAvatar(me.photo_url);
    await deleteParticipant(profile.deviceId);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(DEVICE_KEY);
    window.location.reload();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setConfirmOpen(true)}
        className="backdrop-blur-sm"
      >
        <LogOut />
        나가기
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>방 나가기</DialogTitle>
            <DialogDescription>
              참여자 목록에서 제거되고 처음 화면으로 돌아갑니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleLeave}>
              <LogOut />
              나가기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
