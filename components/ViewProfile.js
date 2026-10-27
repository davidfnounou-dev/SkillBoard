"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Avatar from "@/components/Avatar";
import RatingForm from "@/components/RatingForm";
import { useLang } from "@/lib/i18n";
import { skillLabel } from "@/lib/skills";
import { tenureLabel, shortDate } from "@/lib/helpers";

export default function ViewProfile({ profile, currentUser, onBack, onMessage }) {
  const { t, lang } = useLang();
  const [ratings, setRatings] = useState([]);

  const loadRatings = useCallback(async () => {
    if (!profile) return;
    // Try to also get the reviewer's name; if that join isn't available, load plain ratings.
    let res = await supabase
      .from("ratings")
      .select("*, reviewer:profiles!reviewer_id(name)")
      .eq("reviewee_id", profile.id)
      .order("created_at", { ascending: false });
    if (res.error) {
      res = await supabase
        .from("ratings")
        .select("*")
        .eq("reviewee_id", profile.id)
        .order("created_at", { ascending: false });
    }
    if (!res.error) setRatings(res.data || []);
  }, [profile]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  if (!profile) return null;

  const count = ratings.length;
  const average = count
    ? (ratings.reduce((sum, r) => sum + r.score, 0) / count).toFixed(1)
    : null;

  // The current user's own rating of this person (if any).
  const myRating = currentUser
    ? ratings.find((r) => r.reviewer_id === currentUser.id)
    : null;

  const isOwnProfile = currentUser && currentUser.id === profile.id;
  const reviewsWithComment = ratings.filter((r) => r.comment && r.comment.trim());
  const tenure = tenureLabel(profile.created_at, t);

  function stars(score) {
    return "★★★★★".slice(0, score) + "☆☆☆☆☆".slice(0, 5 - score);
  }

  return (
    <section>
      <button className="btn btn-ghost" onClick={onBack}>{t("view.back")}</button>
      <div className="view-profile-card">
        <div className="view-head">
          <Avatar name={profile.name} photoUrl={profile.photo_url} />
          <div>
            <div className="view-name">{profile.name}</div>
            {profile.location && <div className="view-location">📍 {profile.location}</div>}
            {tenure && <div className="view-tenure">🕒 {tenure}</div>}
            <div className="rating-summary">
              {average ? (
                <>
                  <span className="stars-display">{stars(Math.round(average))}</span>
                  {average} · {t(count === 1 ? "view.ratingOne" : "view.ratingMany", { count })}
                </>
              ) : (
                <span>{t("card.noReviews")}</span>
              )}
            </div>
          </div>
        </div>

        {/* Message button — only when logged in and not your own profile */}
        {currentUser && !isOwnProfile && (
          <button className="btn btn-primary" onClick={() => onMessage(profile.id)}>
            {t("view.sendMessage")}
          </button>
        )}

        {profile.bio && <p className="view-bio">&ldquo;{profile.bio}&rdquo;</p>}

        {(profile.skills || []).length === 0 ? (
          <p className="view-location">{t("view.noSkills")}</p>
        ) : (
          profile.skills.map((s) => (
            <div key={s.id} className="view-skill">
              <h4>{skillLabel(s.skill_name, lang)}</h4>
              {s.experience && <div className="exp">{t("view.experienceOf", { exp: s.experience })}</div>}
              {s.description && <p>{s.description}</p>}
            </div>
          ))
        )}

        {/* Rating form — only when logged in and not your own profile */}
        {currentUser && !isOwnProfile && (
          <RatingForm
            currentUser={currentUser}
            revieweeId={profile.id}
            existing={myRating}
            onSaved={loadRatings}
          />
        )}

        {/* Reviews list */}
        {reviewsWithComment.length > 0 && (
          <div className="reviews">
            <h4>{t("view.reviews")}</h4>
            {reviewsWithComment.map((r) => (
              <div key={r.id} className="review">
                <div className="review-head">
                  <span className="stars-display">{stars(r.score)}</span>
                  <span className="review-by">
                    {(r.reviewer && r.reviewer.name) || t("view.reviewerFallback")}
                    {r.created_at ? ` · ${shortDate(r.created_at, lang)}` : ""}
                  </span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
