import { useRouter } from "expo-router";

export const useAvatar = () => {
  const router = useRouter();
  const selectAvatar = (val: number) => {
    console.log(val);
    router.replace("/home");
  };
  return { selectAvatar };
};
