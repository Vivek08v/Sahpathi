import React from "react";

const ParticipantsList = ({ peers, localUser }) => {
  const peerArray = Array.from(peers.values());

  return (
    <div className="space-y-2">
      {/* Local User First */}
      {localUser && (
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded shadow">
          <div className="flex items-center gap-3">
            <img
              src={localUser.avatar || "/default-profile.png"}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold text-sm">{localUser.fullname} (You)</p>
              <p className="text-xs text-gray-600">{localUser.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Remote Peers */}
      {peerArray.map((peer) => {
        if (peer.id === peers.peerId) return null; // skip self if needed

        return (
          <div
            key={peer.id}
            className="flex items-center justify-between p-2 bg-gray-100 rounded shadow transition hover:bg-gray-200"
          >
            <div className="flex items-center gap-3">
              <img
                src={peer?.userDetail?.image || "/default-profile.png"}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-sm text-black">{peer?.userDetail?.fullname}</p>
                <p className="text-xs text-gray-600">{peer.role}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* No Participants */}
      {peerArray.length === 0 && (
        <p className="text-gray-500 text-center text-sm">No participants yet</p>
      )}
    </div>
  );
};

export default ParticipantsList;