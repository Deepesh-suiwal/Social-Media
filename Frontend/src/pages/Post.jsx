import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../axiosConfig.js";

import {
  Camera,
  Hash,
  Send,
  User,
  Sparkles,
  Heart,
  Smile,
  Star,
} from "lucide-react";

import EmojiPicker from "emoji-picker-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Post = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [profilepic, setProfilePic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHashtagPopup, setShowHashtagPopup] = useState(false);
  const [hashtagQuery, setHashtagQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const textareaRef = useRef(null);
  const emojiRef = useRef(null);
  const buttonRef = useRef(null);

  const editingData = location.state?.post || null;
  const isEditing = location.state?.isEditing || false;

  // Load user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get("/api/users/me");
        const { uniqueId, userName, profilePic } = res.data;
        setUserDetail(res.data);
        setUserId(uniqueId);
        setUserName(userName);
        setProfilePic(profilePic);
      } catch (err) {
        console.error("Fetch user failed:", err);
      }
    };
    fetchUser();
  }, []);

  // If editing, preload data
  useEffect(() => {
    if (editingData) {
      setContent(editingData.content || "");
      setHashtags(editingData.hashtags || "");
      setPreviewImage(editingData.postImageUrl || null);
    }
  }, [editingData]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setImageRemoved(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "#") {
      setShowHashtagPopup(true);
      setHashtagQuery("");
    } else if (showHashtagPopup) {
      if (/^[a-zA-Z0-9_]$/.test(e.key)) {
        setHashtagQuery((prev) => prev + e.key);
      } else if (e.key === " " || e.key === "Enter") {
        setShowHashtagPopup(false);
        setHashtagQuery("");
      }
    }
  };

  const renderHighlightedContent = (text) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("#")) {
        return (
          <span key={i} className="text-blue-500 font-semibold">
            {part}
          </span>
        );
      }
      return (
        <span key={i} className="text-white">
          {part}
        </span>
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("uniqueId", userId);
      formData.append("profilepic", profilepic);
      formData.append("userName", userName);
      formData.append("content", content);
      formData.append("hashtags", hashtags);
      if (postImage) formData.append("postImage", postImage);
      if (isEditing) formData.append("isEdited", true);
      formData.append("removeImage", imageRemoved);

      if (isEditing && editingData.postId) {
        const response = await instance.put(
          `/user/editPost/${editingData.postId}`,
          formData
        );

        if (response.status === 200) {
          toast.success("Post updated successfully!", {
            position: "top-right",
            autoClose: 700,
          });
          setTimeout(() => navigate("/app/my-posts"), 1400);
        }
      } else {
        const res = await instance.post("/user/shareData", formData);
        if (res.status === 201) {
          toast.success("Post created successfully!", {
            position: "top-right",
            autoClose: 700,
          });
          setTimeout(() => navigate("/app/my-posts"), 1400);
        }
      }
    } catch (error) {
      console.error("Post creation failed", error);
      toast.error("Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 py-8 px-4 relative overflow-hidden">
      <ToastContainer />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Star className="absolute top-20 left-20 w-4 h-4 text-yellow-400/30 animate-pulse" />
        <Star className="absolute top-40 right-32 w-3 h-3 text-pink-400/30 animate-pulse delay-300" />
        <Star className="absolute bottom-40 left-1/3 w-5 h-5 text-blue-400/30 animate-pulse delay-700" />
        <Sparkles className="absolute top-32 right-1/4 w-6 h-6 text-purple-400/30 animate-pulse delay-1000" />
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto relative z-10 mt-15">
        <div className="text-center mb-8 flex items-center justify-center gap-6">
          <div className="relative inline-block group">
            {userDetail?.profilePic ? (
              <img
                src={userDetail.profilePic}
                alt="User Profile"
                className="w-30 h-30 object-cover rounded-full border-4 border-white/20 shadow-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 ring-opacity-50 transition-all duration-500 group-hover:scale-110 group-hover:shadow-purple-500/50"
              />
            ) : (
              <div className="w-30 h-30 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-full border-4 border-white/20 shadow-2xl flex items-center justify-center">
                <User className="w-16 h-16 text-white/60" />
              </div>
            )}
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-white">
            <span className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              {userDetail?.userName || "Loading..."}
            </span>
            <p className="text-slate-400 mt-2 text-sm">
              Share your thoughts with your friends
            </p>
          </h1>
        </div>

        {/* Post Form */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="relative w-full min-h-[130px] bg-white/5 border-2 border-white/20 rounded-2xl">
              {/* Textarea */}

              <textarea
                ref={textareaRef}
                className="w-full p-6 min-h-[130px] bg-transparent border-none rounded-2xl resize-none text-transparent placeholder-transparent z-10 relative caret-white focus:outline-none"
                placeholder="What's on your mind? Share something amazing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />

              {/* Visible text overlay */}

              <div className="absolute inset-0 z-0 p-6 whitespace-pre-wrap break-words pointer-events-none">
                {content.length > 0 ? (
                  renderHighlightedContent(content)
                ) : (
                  <span className="text-white/40">
                    What's on your mind? Share something amazing...
                  </span>
                )}
              </div>

              {/* Emoji Picker Toggle */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <span className="text-xs text-white/60 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {content.length} characters
                </span>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  ref={buttonRef}
                  className="p-1 rounded-full hover:bg-white/10 transition"
                >
                  <Smile className="w-5 h-5 text-yellow-400/80" />
                </button>
              </div>

              {showEmojiPicker && (
                <div
                  ref={emojiRef}
                  className="absolute z-50 top-10 right-0 sm:right-6"
                >
                  <div className="max-h-[300px] overflow-y-auto rounded-xl shadow-2xl">
                    <EmojiPicker
                      onEmojiClick={(emojiData) =>
                        setContent((prev) => prev + emojiData.emoji)
                      }
                      theme="dark"
                      autoFocusSearch={false}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preview Image */}
            {previewImage && (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl">
                  <img
                    src={previewImage}
                    alt="Post Preview"
                    className="w-full max-h-80 object-contain bg-black/20 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPostImage(null);
                    setPreviewImage(null);
                    setImageRemoved(true);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                >
                  ×
                </button>
              </div>
            )}

            {/* Upload Image */}
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-6 bg-white/5 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer text-white/70"
              />
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Camera className="w-5 h-5 text-blue-400/60" />
                <span className="text-xs text-white/60 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  Images only
                </span>
              </div>
            </div>

            {/* Hashtags */}
            <div className="relative group">
              <input
                type="text"
                placeholder="#trending #awesome #socialmedia"
                className="w-full p-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white placeholder-white/50 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-purple-400/20 pl-14"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
              />
              <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-400/60" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Publishing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Send className="w-6 h-6" />
                  <span>Share Your Post</span>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/40 text-sm">
            Express yourself • Connect with others • Make an impact
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
