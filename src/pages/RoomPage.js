import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import UserList from "../components/UserList";
import "./RoomPage.css";

const RoomPage = () => {
  const { roomId } = useParams();
  const { currentUser } = useAuth();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoggedJoin, setHasLoggedJoin] = useState(false);

  // Enhanced function to log activities with additional metadata
  const logActivity = useCallback(
    async (action, metadata = {}) => {
      try {
        const activitiesRef = collection(db, "rooms", roomId, "activities");
        await addDoc(activitiesRef, {
          user: currentUser
            ? currentUser.email
            : `Guest_${localStorage
                .getItem(`room_${roomId}_guestId`)
                ?.slice(-4)}`,
          action,
          metadata,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error logging activity:", err);
      }
    },
    [roomId, currentUser]
  );
  // Enhanced file operation handlers with metadata
  const handleFileCreation = async (fileName, fileType) => {
    await logActivity("file_created", {
      fileName,
      fileType,
      operation: "create",
    });
  };

  const handleFileModification = async (fileName, changesSummary = {}) => {
    await logActivity("file_modified", {
      fileName,
      changesSummary,
      operation: "modify",
    });
  };

  const handleFileDeletion = async (fileName) => {
    await logActivity("file_deleted", {
      fileName,
      operation: "delete",
    });
  };

  // New handlers for additional file operations
  const handleFileRename = async (oldFileName, newFileName) => {
    await logActivity("file_renamed", {
      oldFileName,
      newFileName,
      operation: "rename",
    });
  };

  const handleFileUpload = async (fileName, fileSize, fileType) => {
    await logActivity("file_uploaded", {
      fileName,
      fileSize,
      fileType,
      operation: "upload",
    });
  };

  const handleFileDownload = async (fileName) => {
    await logActivity("file_downloaded", {
      fileName,
      operation: "download",
    });
  };

  const handleFileCopy = async (sourceFileName, destinationFileName) => {
    await logActivity("file_copied", {
      sourceFileName,
      destinationFileName,
      operation: "copy",
    });
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomRef = doc(db, "rooms", roomId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          setRoomData({ id: roomSnap.id, ...roomSnap.data() });

          if (!hasLoggedJoin) {
            logActivity("joined_room", {
              operation: "join",
              userType: currentUser ? "registered" : "guest",
            });
            setHasLoggedJoin(true);
          }
        } else {
          setError("Room not found");
        }
      } catch (err) {
        console.error("Error fetching room:", err);
        setError("Failed to load room data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();

    const unsubscribe = onSnapshot(doc(db, "rooms", roomId), (doc) => {
      if (doc.exists()) {
        setRoomData({ id: doc.id, ...doc.data() });
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [roomId, hasLoggedJoin, currentUser, logActivity]);

  if (loading) {
    return (
      <div className="room-loading">
        <h2>Loading room data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-error">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="room-page-container">
      <header className="room-header">
        <div className="room-info">
          <div className="room-title-wrapper">
            <h2 className="room-title">
              <span className="room-icon">🚀</span>
              {roomData?.name || "Untitled Room"}
            </h2>
            <div className="room-meta">
              <span className="room-id">
                <span className="meta-icon">🔑</span> {roomId}
              </span>
              {roomData?.isPrivate && (
                <span className="private-badge">
                  <span className="lock-icon">🔒</span> Private Room
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="user-info">
          <div className="user-greeting">
            <span className="welcome-icon">👋</span>
            <span className="welcome-text">
              Welcome,{" "}
              <span className="user-identity">
                {currentUser
                  ? currentUser.email
                  : `Guest_${localStorage
                      .getItem(`room_${roomId}_guestId`)
                      ?.slice(-4)}`}
              </span>
            </span>
          </div>
          {roomData?.creatorEmail && (
            <div className="room-creator">
              <span className="creator-icon">👑</span>
              Created by:{" "}
              <span className="creator-name">{roomData.creatorEmail}</span>
            </div>
          )}
        </div>
      </header>

      <div className="room-content">
        <div className="editor-section">
          <CodeEditor
            roomId={roomId}
            logActivity={logActivity}
            onFileCreate={handleFileCreation}
            onFileModify={handleFileModification}
            onFileDelete={handleFileDeletion}
            onFileRename={handleFileRename}
            onFileUpload={handleFileUpload}
            onFileDownload={handleFileDownload}
            onFileCopy={handleFileCopy}
          />
        </div>

        <div className="side-section">
          <div className="user-list-container">
            <UserList roomId={roomId} />
          </div>
          <div className="chat-container">
            <Chat roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
