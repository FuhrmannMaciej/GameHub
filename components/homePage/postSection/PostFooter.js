import React, { Component } from "react";
import { View, Text, Modal } from "react-native";
import colors from "../../../colors";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "../../EntypoIcon";
import { TextInput } from "react-native";
import { database } from "../../../config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

class PostFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: this.props.likes,
      commentModalVisible: false,
      commentText: "",
      commentsCount: 0,
      showComments: false,
      commentsData: [],
    };
  }

  componentDidMount() {
    this.countComments();
  }

  handleLike = () => {
    this.setState((prevState) => ({
      likes: prevState.likes + 1,
    }));
  };

  toggleCommentModal = () => {
    this.setState(
      (prevState) => ({
        commentModalVisible: !prevState.commentModalVisible,
      }),
      () => {
        console.log("Comment modal visible:", this.state.commentModalVisible);
      }
    );
  };

  toggleComments = () => {
    this.setState(
      (prevState) => ({
        showComments: !prevState.showComments,
      }),
      () => {
        console.log("Comments visible:", this.state.showComments);
      }
    );
  };

  handleCommentTextChange = (text) => {
    this.setState({ commentText: text });
  };

  submitComment = () => {
    const { commentText } = this.state;
    const { imagePath } = this.props;

    const parts = imagePath.split("/");

    addDoc(
      collection(
        database,
        `gamers/${parts[1]}/posts/${this.props.postId}/comments`
      ),
      {
        textContent: commentText,
      }
    )
      .then((docRef) => {
        console.log("Comment added with ID: ", docRef.id);
        this.countComments();
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
      });

    this.setState({ commentText: "" });
    this.toggleCommentModal();
  };

  countComments = () => {
    const { imagePath } = this.props;
    const parts = imagePath.split("/");
    const commentsRef = collection(
      database,
      `gamers/${parts[1]}/posts/${this.props.postId}/comments`
    );
    getDocs(commentsRef).then((commentsSnapshot) => {
      this.setState({ commentsCount: commentsSnapshot.size });
    });
  };

  renderCommentModal() {
    const { commentModalVisible, commentText } = this.state;

    if (!commentModalVisible) {
      return null;
    }

    return (
      <View style={styles.commentModalContainer}>
        <View style={styles.commentModalContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Enter your comment"
              value={commentText}
              onChangeText={this.handleCommentTextChange}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.submitComment}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={this.toggleCommentModal}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderCommentsList() {

    if (!this.state.showComments) {
      return null;
    }

    const { imagePath } = this.props;
    const { commentsData } = this.state;
    const parts = imagePath.split("/");
    const commentsRef = collection(
      database,
      `gamers/${parts[1]}/posts/${this.props.postId}/comments`
    );
    getDocs(commentsRef).then((commentsSnapshot) => {
      this.setState({
        commentsData: commentsSnapshot.docs.map((doc) => doc.data()),
      });
    });

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.showComments}
        onRequestClose={this.toggleComments}
      >
        <View style={styles.modalContainer}>
          <View style={styles.commentsListContainer}>
            {commentsData.map((comment, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.commentItem]}
              >
                <Text style={styles.commentText}>{comment.textContent}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View style={styles.postFooter}>
        <View style={styles.postFooterTop}>
          <View style={styles.postLikes}>
            <EntypoIcon name="heart" color="red" style={styles.likeIcon} />
            <Text style={styles.likesCount}>{this.state.likes}</Text>
          </View>
          <View style={styles.postComments}>
            <TouchableOpacity onPress={this.toggleComments}>
              <Text style={styles.commentsCount}>
                {this.state.commentsCount}
              </Text>
              <Text style={styles.comments}>comments</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.postFooterBottom}>
          <TouchableOpacity
            style={styles.postFooterButton}
            onPress={this.handleLike}
          >
            <EntypoIcon name="thumbs-up" />
            <Text style={styles.postFooterButtonText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postFooterButton}
            onPress={this.toggleCommentModal}
          >
            <EntypoIcon name="message" />
            <Text style={styles.postFooterButtonText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postFooterButton}>
            <EntypoIcon name="paper-plane" />
            <Text style={styles.postFooterButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        {this.renderCommentsList()}
        {this.renderCommentModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  postFooter: {
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  postFooterTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    marginBottom: 7,
  },
  postFooterBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "space-between",
    flex: 1,
    marginBottom: 7,
  },
  postFooterButtonText: {
    fontSize: 14,
    color: colors.darkGrey,
    marginLeft: 10,
  },
  likeIcon: {
    marginLeft: 15,
  },
  likesCount: {
    fontSize: 14,
    color: colors.darkGrey,
    marginLeft: 8,
  },
  postFooterButton: {
    flexDirection: "row",
    flex: 1,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
  },
  postLikes: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  likes: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  postComments: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    flex: 1,
    marginBottom: 7,
  },
  comments: {
    fontSize: 14,
    color: colors.darkGrey,
    marginRight: 15,
  },
  commentsCount: {
    fontSize: 14,
    color: colors.darkGrey,
    marginRight: 5,
  },
  commentModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  commentModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  commentInput: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  submitButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  commentsListContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    maxHeight: "70%",
    width: "80%",
    overflow: "hidden",
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
  },
  commentText: {
    fontSize: 16,
    color: colors.darkGrey,
  },
});

export default PostFooter;
