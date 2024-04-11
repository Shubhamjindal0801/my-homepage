import { Button, Form, Input, Modal, message } from "antd";
import { db } from "../firebase";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";

interface Props {
  data: any;
  user: any;
  updateModal: boolean;
  setUpdateModal: (val: boolean) => void;
  fetchBookmarks: any;
  index: number;
}
const UpdateBookmark = (props: Props) => {
  const { data, user, updateModal, setUpdateModal, fetchBookmarks, index } =
    props;

  const handleUpdateBookmark = async (values: any) => {
    const { title, link } = values;
    if (title?.trim() === data.title && link?.trim() === data.link) {
      message.error("No changes made to original bookmark");
      setUpdateModal(!updateModal);
      return;
    }
    message.loading("Updating Bookmark");
    try {
      const q = query(collection(db, `users/${user.uid}/bookmarks`));
      const querySnapshot = await getDocs(q);
      const queryId = querySnapshot.docs[index].id;
      const userRef = collection(db, "users");
      const documentRef = doc(userRef, user.uid, "bookmarks", queryId);
      await updateDoc(documentRef, values);
      message.success("Bookmark Updated");
      fetchBookmarks();
      setUpdateModal(!updateModal);
    } catch (error) {
      message.error("Error updating bookmark");
    }
  };
  return (
    <>
      <Modal
        title="Update Bookmark"
        open={updateModal}
        closable
        onCancel={() => setUpdateModal(!updateModal)}
        footer={false}
      >
        <div>
          <h1>Update Bookmark</h1>
          <Form onFinish={handleUpdateBookmark}>
            <Form.Item
              label="Title"
              name="title"
              initialValue={data.title}
              rules={[
                {
                  required: true,
                  message: "Please input your title!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="URL"
              name="link"
              initialValue={data.link}
              rules={[
                {
                  required: true,
                  message: "Please input your url!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Bookmark
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default UpdateBookmark;
