import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BasicKidooProvider } from "@/contexts/BasicKidooContext";
import { KidooProvider } from "@/contexts/KidooContext";
import { StorageInfo, WifiConfigSheet } from "../../components";
import { ActionsMenu, DeleteSheet, RenameSheet } from "./_components";
import { BrightnessModal } from "./brightness-modal";
import { SleepModal } from "./sleep-modal";
import { useBottomSheet } from "@/components/ui/bottom-sheet";
import { ThemedView } from "@/components/themed-view";
import { ThemedScrollView } from "@/components/themed-scroll-view";

interface BasicDetailModalProps {
  kidooId: string;
}

export function BasicDetailModal({ kidooId }: BasicDetailModalProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const renameSheet = useBottomSheet();
  const wifiSheet = useBottomSheet();
  const brightnessSheet = useBottomSheet();
  const sleepSheet = useBottomSheet();
  const deleteSheet = useBottomSheet();

  const handleTags = () => {
    router.push(`/kidoo/${kidooId}/tags`);
  };

  return (
    <KidooProvider kidooId={kidooId} autoConnect={true}>
      <BasicKidooProvider>
        <ThemedView>
        <StorageInfo />
          <ThemedScrollView
            contentContainerStyle={{
              paddingBottom: insets.bottom,
            }}
          >
           
            <ActionsMenu
              onRename={() => renameSheet.present()}
              onBrightness={() => brightnessSheet.present()}
              onSleep={() => sleepSheet.present()}
              onWifiConfig={() => wifiSheet.present()}
              onTags={handleTags}
              onDelete={() => deleteSheet.present()}
            />
          </ThemedScrollView>

          <RenameSheet ref={renameSheet.ref} />

          <BrightnessModal ref={brightnessSheet.ref} />

          <SleepModal ref={sleepSheet.ref} />

          <WifiConfigSheet ref={wifiSheet.ref} />

          <DeleteSheet ref={deleteSheet.ref} />
        </ThemedView>
      </BasicKidooProvider>
    </KidooProvider>
  );
}