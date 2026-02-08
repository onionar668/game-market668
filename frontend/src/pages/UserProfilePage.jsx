import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import ProductCard from "../components/ProductCard";
import { UserIcon, MessageCircleIcon, ArrowLeftIcon } from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:1515";

function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const { loading } = useProductStore();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/${id}`);
        setProfile(res.data.data);
      } catch {
        setProfile(null);
      }
    };
    load();
  }, [id]);

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="loading loading-lg" />
      </div>
    );
  }

  const { email, products } = profile;
  const isOwnProfile = currentUser?.id === parseInt(id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-4">
        <ArrowLeftIcon className="size-5" />
        Back
      </button>

      <div className="card bg-base-100 shadow-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-16">
                <UserIcon className="size-8" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{email}</h1>
              <p className="text-base-content/70">
                {products?.length || 0} products
              </p>
            </div>
          </div>
          {isAuthenticated() && !isOwnProfile && (
            <button
              onClick={() => navigate(`/messages?to=${id}`)}
              className="btn btn-primary gap-2"
            >
              <MessageCircleIcon className="size-5" />
              Message
            </button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Products</h2>
      {products?.length === 0 ? (
        <div className="text-center py-12 text-base-content/70">
          No products yet
        </div>
      ) : (
        <div className="flex flex-wrap gap-10">
          {products?.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, User: { id: profile.id, email: profile.email } }}
              showEditDelete={isOwnProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
