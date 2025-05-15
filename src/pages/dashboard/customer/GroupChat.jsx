import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetGroupDetailsQuery,
  useGetGroupDiscussionsQuery,
  useAddDiscussionMutation,
  useDeleteDiscussionMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "../../../redux/slices/groupApiSlice";
import {
  Send,
  ArrowLeft,
  Users,
  MoreVertical,
  Trash2,
  Paperclip,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import EmojiPicker from "emoji-picker-react";
import ReactPlayer from "react-player";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

const GroupChat = () => {
  const { groupId } = useParams();
  const [message, setMessage] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [attachmentType, setAttachmentType] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);

  // Cloudinary upload preset and cloud name - replace with your actual values
  const CLOUDINARY_UPLOAD_PRESET = "your_upload_preset";
  const CLOUDINARY_CLOUD_NAME = "your_cloud_name";
  const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  // Fetch group details
  const {
    data: group = {},
    isLoading: isLoadingGroup,
    refetch: refetchGroup,
  } = useGetGroupDetailsQuery(groupId);

  // Fetch discussions
  const {
    data: discussions = [],
    isLoading: isLoadingDiscussions,
    isError: isErrorDiscussions,
    refetch: refetchDiscussions,
  } = useGetGroupDiscussionsQuery(groupId);

  // Mutations
  const [addDiscussion] = useAddDiscussionMutation();
  const [deleteDiscussion] = useDeleteDiscussionMutation();
  const [joinGroup] = useJoinGroupMutation();
  const [leaveGroup] = useLeaveGroupMutation();

  // Auto-scroll to bottom when discussions update
  useEffect(() => {
    scrollToBottom();
  }, [discussions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user is a member of the group
  const isMember = group.members?.some((member) => member._id === userInfo._id);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !attachment) return;

    try {
      setIsUploading(true);
      let imageUrl, videoUrl;

      // Upload attachment to Cloudinary if exists
      if (attachment) {
        if (attachmentType === "image") {
          imageUrl = await uploadToCloudinary(attachment);
        } else if (attachmentType === "video") {
          videoUrl = await uploadToCloudinary(attachment);
        }
      }

      // Prepare the payload for your backend
      const payload = {
        groupId,
        message: message.trim(),
        ...(imageUrl && { image: imageUrl }),
        ...(videoUrl && { video: videoUrl }),
      };

      await addDiscussion(payload).unwrap();
      setMessage("");
      setAttachment(null);
      setAttachmentPreview(null);
      setAttachmentType(null);
      refetchDiscussions();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle joining/leaving group
  const handleGroupAction = async () => {
    try {
      if (isMember) {
        await leaveGroup(groupId).unwrap();
        toast.success("You have left the group");
      } else {
        await joinGroup(groupId).unwrap();
        toast.success("You have joined the group");
      }
      refetchGroup();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to perform action");
    }
  };

  // Handle deleting a discussion
  const handleDeleteDiscussion = async (discussionId) => {
    try {
      await deleteDiscussion(discussionId).unwrap();
      refetchDiscussions();
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete message");
    } finally {
      setShowOptions(null);
    }
  };

  // Handle file attachment
  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setAttachment(file);

    // Determine file type
    if (file.type.startsWith("image/")) {
      setAttachmentType("image");
      const reader = new FileReader();
      reader.onload = () => setAttachmentPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      setAttachmentType("video");
      const videoUrl = URL.createObjectURL(file);
      setAttachmentPreview(videoUrl);
    } else {
      toast.error("Only images and videos are supported");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
  };

  // Remove attachment
  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    setAttachmentType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Get all media attachments for lightbox
  const mediaAttachments = discussions
    .filter((d) => d.image || d.video)
    .map((d) => ({
      url: d.image || d.video,
      type: d.image ? "image" : "video",
      id: d._id,
    }));

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (isLoadingGroup) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton type={"list"} count={3} />
      </div>
    );
  }

  return (
    <div className="h-screen  flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Link to="/dashboard/chats" className="mr-3">
            <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Link>
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-200 overflow-hidden mr-3">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Users className="h-full w-full p-1.5 text-purple-400" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold capitalize">{group.name}</h2>
            <p className="text-sm text-gray-500">
              {group.members?.length || 0}{" "}
              {group.members?.length === 1 ? "member" : "members"}
            </p>
          </div>
        </div>
        <button
          onClick={handleGroupAction}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            isMember
              ? "bg-red-100 text-red-800 hover:bg-red-200"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {isMember ? "Leave Group" : "Join Group"}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingDiscussions ? (
          <div className="text-center text-gray-500 py-4">
            <LoadingSkeleton type={"list"} count={3} />
          </div>
        ) : isErrorDiscussions ? (
          <div className="text-center text-gray-500 py-4">
            Error loading messages
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          discussions.map((discussion) => {
            const isCurrentUser = discussion.user?._id === userInfo._id;
            const isAdmin = userInfo._id === group.admin?._id;
            const canDelete = isCurrentUser || isAdmin;
            const hasAttachment = discussion.image || discussion.video;

            // Find index for lightbox
            const mediaIndex = mediaAttachments.findIndex(
              (m) => m.id === discussion._id
            );

            return (
              <div
                key={discussion._id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] relative group ${
                    isCurrentUser ? "flex-row-reverse" : ""
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-2 mt-1">
                      {discussion.user?.avatar ? (
                        <img
                          src={discussion.user.avatar}
                          alt={discussion.user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-purple-500 text-white">
                          {discussion.user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`flex-1 ${isCurrentUser ? "mr-2" : "ml-2"}`}>
                    {!isCurrentUser && (
                      <p className="text-xs text-gray-500 mb-1">
                        {discussion.user?.name || "Unknown User"}
                      </p>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 break-words relative ${
                        isCurrentUser
                          ? "bg-purple-500 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      } ${hasAttachment ? "p-0 overflow-hidden" : ""}`}
                    >
                      {hasAttachment && (
                        <div className="relative">
                          {discussion.image ? (
                            <img
                              src={discussion.image}
                              alt="Attachment"
                              className="max-w-full max-h-64 object-contain cursor-pointer"
                              onClick={() =>
                                mediaIndex >= 0 && openLightbox(mediaIndex)
                              }
                            />
                          ) : discussion.video ? (
                            <div className="relative pt-[56.25%]">
                              <ReactPlayer
                                url={discussion.video}
                                controls
                                width="100%"
                                height="100%"
                                className="absolute top-0 left-0"
                              />
                            </div>
                          ) : null}
                          {discussion.message && (
                            <div
                              className={`p-3 ${
                                hasAttachment ? "border-t border-gray-200" : ""
                              }`}
                            >
                              <p>{discussion.message}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {!hasAttachment && <p>{discussion.message}</p>}

                      {canDelete && (
                        <button
                          onClick={() =>
                            setShowOptions(
                              showOptions === discussion._id
                                ? null
                                : discussion._id
                            )
                          }
                          className={`absolute ${
                            isCurrentUser ? "right-2" : "left-2"
                          } top-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isCurrentUser
                              ? "text-white"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      )}
                      {showOptions === discussion._id && (
                        <div
                          className={`absolute ${
                            isCurrentUser ? "left-0" : "right-0"
                          } top-8 bg-white shadow-lg rounded-md z-10 border border-gray-200`}
                        >
                          <button
                            onClick={() =>
                              handleDeleteDiscussion(discussion._id)
                            }
                            className="flex items-center px-3 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-xs text-gray-500 mt-1 ${
                        isCurrentUser ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(discussion.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Lightbox for media */}
      {lightboxOpen && (
        <Lightbox
          mainSrc={mediaAttachments[lightboxIndex].url}
          nextSrc={
            mediaAttachments[(lightboxIndex + 1) % mediaAttachments.length]?.url
          }
          prevSrc={
            mediaAttachments[
              (lightboxIndex + mediaAttachments.length - 1) %
                mediaAttachments.length
            ]?.url
          }
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex(
              (lightboxIndex + mediaAttachments.length - 1) %
                mediaAttachments.length
            )
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % mediaAttachments.length)
          }
        />
      )}

      {/* Input - Only show if user is a member */}
      {isMember && (
        <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0">
          {attachmentPreview && (
            <div className="relative mb-3 rounded-lg overflow-hidden border border-gray-200 max-w-xs">
              {attachmentType === "image" ? (
                <img
                  src={attachmentPreview}
                  alt="Preview"
                  className="max-h-40 object-contain"
                />
              ) : attachmentType === "video" ? (
                <div className="relative pt-[56.25%]">
                  <ReactPlayer
                    url={attachmentPreview}
                    controls
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0"
                  />
                </div>
              ) : null}
              <button
                onClick={removeAttachment}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-purple-600"
                >
                  😊
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-gray-500 hover:text-purple-600"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAttachment}
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 z-20">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setMessage((prev) => prev + emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                    width={300}
                    height={350}
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={
                (!message.trim() && !attachment) ||
                isLoadingDiscussions ||
                isUploading
              }
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {isUploading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
