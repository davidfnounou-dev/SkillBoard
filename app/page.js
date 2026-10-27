"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase, openedFromRecoveryLink } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import AuthForm from "@/components/AuthForm";
import ResetPassword from "@/components/ResetPassword";
import Browse from "@/components/Browse";
import MyProfile from "@/components/MyProfile";
import ViewProfile from "@/components/ViewProfile";
import Messages from "@/components/Messages";
import { useLang } from "@/lib/i18n";
import { skillId, phon } from "@/lib/skills";

export default function Home() {
  const { t } = useLang();
  // Which screen: "browse" | "auth" | "reset" | "profile" | "viewProfile" | "messages"
  const [view, setView] = useState("browse");
  const [authMode, setAuthMode] = useState("login");
  const [authIntent, setAuthIntent] = useState("client");
  const [currentUser, setCurrentUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [viewingId, setViewingId] = useState(null);
  const [messagePartnerId, setMessagePartnerId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- Load the directory (all profiles + skills + rating averages + latest review) ---
  const loadDirectory = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, location, bio, photo_url, created_at, skills(id, skill_name, experience, description)")
      .order("created_at", { ascending: false });
    if (error) return;

    // Pull all ratings once, then compute average + count + latest written review per person.
    // First try with the reviewer's name; if that join isn't available, fall back to plain ratings.
    let ratingRows = [];
    const withNames = await supabase
      .from("ratings")
      .select("reviewee_id, score, comment, created_at, reviewer:profiles!reviewer_id(name)")
      .order("created_at", { ascending: false });
    if (!withNames.error) {
      ratingRows = withNames.data || [];
    } else {
      const plain = await supabase
        .from("ratings")
        .select("reviewee_id, score, comment, created_at")
        .order("created_at", { ascending: false });
      ratingRows = plain.data || [];
    }

    const byUser = {};
    ratingRows.forEach((r) => {
      if (!byUser[r.reviewee_id]) byUser[r.reviewee_id] = { sum: 0, count: 0, latest: null };
      const agg = byUser[r.reviewee_id];
      agg.sum += r.score;
      agg.count += 1;
      // Rows come newest first, so the first written review we see is the latest.
      if (!agg.latest && r.comment && r.comment.trim().length >= 8) {
        agg.latest = {
          text: r.comment.trim(),
          name: r.reviewer && r.reviewer.name ? r.reviewer.name : "",
          score: r.score,
        };
      }
    });

    const withRatings = (data || []).map((p) => {
      const agg = byUser[p.id];
      return {
        ...p,
        avgRating: agg ? agg.sum / agg.count : 0,
        ratingCount: agg ? agg.count : 0,
        latestReview: agg ? agg.latest : null,
      };
    });
    setProfiles(withRatings);
  }, []);

  // --- Count unread messages for the badge ---
  const loadUnread = useCallback(async (userId) => {
    const id = userId || (currentUser && currentUser.id);
    if (!id) { setUnreadCount(0); return; }
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", id)
      .eq("is_read", false);
    setUnreadCount(count || 0);
  }, [currentUser]);

  // --- Figure out who (if anyone) is logged in ---
  const loadSession = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data && data.user) {
      let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();
      // Auth user exists but has no profile row (e.g. profile insert failed
      // or the row was deleted): repair it instead of signing them out.
      if (!profile) {
        const fallbackName =
          (data.user.user_metadata && data.user.user_metadata.name) ||
          (data.user.email || "").split("@")[0];
        const { data: created } = await supabase
          .from("profiles")
          .upsert({ id: data.user.id, name: fallbackName })
          .select()
          .single();
        profile = created;
      }
      const u = { id: data.user.id, email: data.user.email, ...(profile || {}) };
      setCurrentUser(u);
      loadUnread(u.id);
    } else {
      setCurrentUser(null);
      setUnreadCount(0);
    }
  }, [loadUnread]);

  // --- On first load ---
  useEffect(() => {
    (async () => {
      await loadSession();
      await loadDirectory();
      setLoading(false);
    })();
  }, [loadSession, loadDirectory]);

  // --- The person opened the "reset my password" link from their email ---
  useEffect(() => {
    // The event can fire before this listener exists, so also check the link itself.
    if (openedFromRecoveryLink) setView("reset");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setView("reset");
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // --- Numbers for the stats bar (all real, computed from the database) ---
  const stats = useMemo(() => {
    const pros = profiles.filter((p) => (p.skills || []).length > 0);
    const trades = new Set();
    const zones = new Set();
    pros.forEach((p) => {
      p.skills.forEach((s) => trades.add(skillId(s.skill_name)));
      const place = (p.location || "")
        .split(",")[0]
        .replace(/^(ciudad|provincia|distrito|corregimiento) de /i, "");
      const key = phon(place);
      if (key) zones.add(key);
    });
    let reviews = 0;
    let weighted = 0;
    profiles.forEach((p) => {
      reviews += p.ratingCount;
      weighted += p.avgRating * p.ratingCount;
    });
    return {
      pros: pros.length,
      professions: trades.size,
      zones: zones.size,
      reviews,
      avg: reviews ? weighted / reviews : 0,
    };
  }, [profiles]);

  // --- Navigation handlers ---
  function goBrowse() {
    loadDirectory();
    setView("browse");
  }

  function openAuth(mode, intent = "client") {
    setAuthMode(mode);
    setAuthIntent(intent);
    setView("auth");
  }

  async function handleLoggedIn() {
    await loadSession();
    goBrowse();
  }

  async function handleSignedUp(intent) {
    await loadSession();
    if (intent === "professional") {
      setView("profile"); // go add your first service
    } else {
      goBrowse();
    }
  }

  async function handlePasswordDone() {
    await loadSession();
    goBrowse();
  }

  async function logout() {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUnreadCount(0);
    goBrowse();
  }

  function openMyProfile() {
    if (!currentUser) { openAuth("login"); return; }
    setView("profile");
  }

  function openViewProfile(id) {
    setViewingId(id);
    setView("viewProfile");
  }

  function openMessages(partnerId = null) {
    if (!currentUser) { openAuth("login"); return; }
    setMessagePartnerId(partnerId);
    setView("messages");
  }

  function scrollToBoard() {
    const el = document.getElementById("tablero");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    const input = document.getElementById("searchInput");
    if (input) setTimeout(() => input.focus({ preventScroll: true }), 350);
  }

  const viewingProfile = profiles.find((p) => p.id === viewingId);
  const showHome = !loading && view === "browse";

  return (
    <>
      <Header
        currentUser={currentUser}
        unreadCount={unreadCount}
        onBrand={goBrowse}
        onLogin={() => openAuth("login")}
        onSignup={() => openAuth("signup", "client")}
        onProfile={openMyProfile}
        onMessages={() => openMessages(null)}
        onLogout={logout}
      />

      <main className="container">
        {showHome && (
          <>
            <Hero
              currentUser={currentUser}
              onClient={() => openAuth("signup", "client")}
              onPro={() => openAuth("signup", "professional")}
              onLogin={() => openAuth("login")}
              onExplore={scrollToBoard}
              onSearch={scrollToBoard}
              onOffer={openMyProfile}
            />
            <StatsBar stats={stats} />
          </>
        )}

        {loading ? (
          <p className="empty-state">{t("app.loading")}</p>
        ) : view === "reset" ? (
          <ResetPassword onDone={handlePasswordDone} />
        ) : view === "auth" ? (
          <AuthForm
            mode={authMode}
            setMode={setAuthMode}
            initialIntent={authIntent}
            onLoggedIn={handleLoggedIn}
            onSignedUp={handleSignedUp}
          />
        ) : view === "profile" && currentUser ? (
          <MyProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onBack={goBrowse}
          />
        ) : view === "messages" && currentUser ? (
          <Messages
            currentUser={currentUser}
            profiles={profiles}
            initialPartnerId={messagePartnerId}
            onBack={goBrowse}
            onUnreadChange={() => loadUnread()}
          />
        ) : view === "viewProfile" ? (
          <ViewProfile
            profile={viewingProfile}
            currentUser={currentUser}
            onBack={goBrowse}
            onMessage={(id) => openMessages(id)}
          />
        ) : (
          <Browse profiles={profiles} onOpenProfile={openViewProfile} />
        )}
      </main>

      <footer className="site-footer">
        <p>Red de Vecinos</p>
      </footer>
    </>
  );
}
