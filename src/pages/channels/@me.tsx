// @ts-nocheck
import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import tw from "tailwind-styled-components";
import { setUser, resetUserState, useUserState } from "../../features/user";
import { useAppDispatch } from "../../redux/hooks";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useServersState } from "../../features/servers";
import { db } from "../../../firebase";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const auth = getAuth();
  const { user } = useUserState();
  const { channel } = useServersState();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authStateListener = onAuthStateChanged(auth, async (user) => {
      if (!user) return redirect();

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return redirect();

      const docData = docSnap.data();

      const currentUser = {
        username: docData.username,

        tag: docData.tag,

        avatar: docData.avatar,

        about: docData.about,

        banner: docData.banner,

        userID: user.uid,

        email: user.email,
      };

      dispatch(setUser(currentUser));
    });
    return () => {
      authStateListener();
    };
  }, [auth, dispatch, redirect]);

  useEffect(() => {
    if (!user.userID) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.userID), (doc) => {
      if (!doc.exists()) return;

      const docData = doc.data();

      const currentUser = {
        username: docData.username,

        tag: docData.tag,

        avatar: docData.avatar,

        about: docData.about,

        banner: docData.banner,

        userID: doc.id,

        email: docData.email,
      };

      dispatch(setUser(currentUser));
    });

    return () => {
        unsubscribe();
    };
  }, [dispatch, user.userID]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function redirect() {
    dispatch(resetUserState());

    router.push("/login");
  }

  return (
    <PageContainer>
      <Head>
        <title>{channel.name ? channel.name : "Disclown"}</title>

        <link rel="manifest" href="/manifest.json" />
      </Head>
    </PageContainer>
  );
};

const PageContainer = tw.div`
  flex w-screen h-screen overflow-hidden select-none
`;

export default Home;