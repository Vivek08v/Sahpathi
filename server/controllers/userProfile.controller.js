import { User } from "../models/user.model.js";

export const followOrUnfollowAFriendRequest = async (req, res) => {
  try {
    const { friendId, toFollow, } = req.body;
    const myUserId = req.user.id;
    console.log(myUserId, friendId, toFollow);

    if (!friendId || toFollow === null) {
      return res.status(400).json({
        status: false,
        message: "Missing Data",
      });
    }

    const friend = await User.findById(friendId);
    const myself = await User.findById(myUserId);
    console.log(friend)
    if (!friend || !myself) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    let response;

    if (toFollow) {
      const alreadyFollows = myself.following.some(
        (id) => id.toString() === friendId.toString()
      );

      if (!alreadyFollows) {
        friend.followers.push(myUserId);

        myself.following.push(friendId);

        friend.followBackList.push({
          from: myUserId,
          status: "Pending",
        });

        await friend.save();
        await myself.save();
      }

      response = { from: myUserId, to: friendId, toFollow };
    } 
    else {
    //   console.log("unfollow");

      friend.followers = friend.followers.filter(
        (id) => id.toString() !== myUserId.toString()
      );
      myself.following = myself.following.filter(
        (id) => id.toString() !== friendId.toString()
      );

      friend.followBackList = friend.followBackList.filter(
        (reqObj) => reqObj.from.toString() !== myUserId.toString()
      );

      await friend.save();
      await myself.save();

      response = { from: myUserId, to: friendId, toFollow };
    }

    return res.status(200).json({
      success: true,
      data: response,
      message: `${toFollow ? "Followed" : "Unfollowed"} friend ${friendId} successfully`,
    });
  } catch (error) {
    console.log("500, Server Error", error);
    return res.status(500).json({
      status: false,
      message: "Error in following/unfollowing a friend: " + error.message,
    });
  }
};
